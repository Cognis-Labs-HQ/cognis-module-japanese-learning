export function withConfiguration(ctx = {}) {
    let saved;
    const database = {
        async ensureTable() {},
        async executeCommand(command) {
            if (command.option === "SELECT")
                return { rows: saved ? [{ value: saved }] : [] };
            if (command.option === "INSERT") saved = command.values.value;
            if (command.option === "DELETE") saved = undefined;
            return { rows: [] };
        },
    };
    const flows = new Map();
    const hooks = new Map();
    return {
        ...ctx,
        getCapability(id) {
            return id === "db:executor" ? database : ctx.getCapability?.(id);
        },
        registerApiGet: ctx.registerApiGet ?? (() => {}),
        registerApiPut: ctx.registerApiPut ?? (() => {}),
        registerApiDelete: ctx.registerApiDelete ?? (() => {}),
        registerFlow({ id, stages }) {
            flows.set(id, stages);
        },
        flow: {
            ...ctx.flow,
            extend(id, stage, metadata, handler) {
                if (!flows.has(id))
                    return ctx.flow?.extend(id, stage, metadata, handler);
                const key = `${id}:${stage}`;
                hooks.set(key, [...(hooks.get(key) ?? []), handler]);
            },
            async run(id, input) {
                if (!flows.has(id)) throw new Error("unknown_flow");
                const data = {};
                for (const stage of flows.get(id))
                    for (const handler of hooks.get(`${id}:${stage}`) ?? [])
                        await handler({ input, data });
                return { data };
            },
        },
    };
}
