declare namespace WorkflowDocker {


    namespace Cli {

        /**
         * Flags for meow
         */
        interface Flags {
            /**
             *  Prints docker build output
             */
            verbose: boolean,
            /**
             *  Do not use cache when building
             */
            noCache: boolean,
            /**
             *  Prints debug info (like stack trace)
             */
            debug: boolean
        }
    }

    /**
     * meow result with our type hints
     */
    interface Cli {
        input: string[],
        flags: WorkflowDocker.Cli.Flags,
        pkg: object
    }

    interface Options {
        /**
         * Docker image name.
         */
        imageName: string,

        /**
         * A list of tags to build (and generate docker file).
         */
        tags: string[],

        /**
         * Flags converted camelCase including aliases.
         */
        tasks: Tasks,

        /**
         * A list of commands to execute on docker image that was processed.
         */
        run: string[] | undefined,

        description: string
    }

    interface Tasks {
        /**
         * The image will be built
         */
        build: boolean,
        /**
         * The image will be pushed.
         */
        push: boolean,
        /**
         * We are going to generate readme
         */
        generateReadme: boolean
    }

    namespace Build {
        interface Context {
            /**
             * The image will be built
             */
            options: Options,
            /**
             * Cli
             */
            cli: Cli,
            /**
             * Current generated readme section for tags
             */
            readmeTags: string,
            /**
             * The docker template
             */
            dockerFileTemplate: string
        }
    }

    interface Config {
        /**
         * A description for readme.
         */
        description: string | undefined
        /**
         * A list of commands to execute on docker image that was processed.
         */
        run: string[] | undefined,
        /**
         * Docker image name.
         */
        image: string,

        /**
         * A list of tags to build (and generate docker file).
         */
        tags: string[],
    }

    interface Package {
        'wf-docker': Config,
        description: string
    }
}
