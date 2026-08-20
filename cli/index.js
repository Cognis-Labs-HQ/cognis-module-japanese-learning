export function registerCli(cli) {
    cli.command({
        name: "study:japanese:status",
        description: "Show the Cognis Japanese module status.",
        access: { minRole: "admin" },
        async run(_args, ctx) {
            const language = ctx.getCapability("study:language:ja");
            return language
                ? {
                      enabled: true,
                      languageCode: language.languageCode,
                      version: language.version,
                  }
                : { enabled: false };
        },
    });
}
