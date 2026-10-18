const TABLE = "module_study_language_ja_config";

export class Configuration {
    value = {};

    constructor(database) {
        this.database = database;
    }

    async load() {
        await this.database.ensureTable({
            name: TABLE,
            columns: [
                { name: "id", type: "text", primaryKey: true },
                { name: "value", type: "text", notNull: true },
            ],
        });
        const result = await this.database.executeCommand({
            option: "SELECT",
            table: TABLE,
            columns: ["value"],
            where: [{ column: "id", value: "voice" }],
        });
        this.value = result.rows?.[0] ? JSON.parse(result.rows[0].value) : {};
        return this.value;
    }

    async save(input) {
        const value = input.voiceId ? { voiceId: input.voiceId } : {};
        const encoded = JSON.stringify(value);
        await this.database.executeCommand({
            option: "INSERT",
            table: TABLE,
            values: { id: "voice", value: encoded },
            conflict: {
                action: "update",
                target: ["id"],
                update: { value: encoded },
            },
        });
        this.value = value;
        return value;
    }

    async clear() {
        await this.database.executeCommand({ option: "DELETE", table: TABLE });
        this.value = {};
    }
}
