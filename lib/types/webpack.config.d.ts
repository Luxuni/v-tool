import { CleanWebpackPlugin } from "clean-webpack-plugin";
export namespace experiments {
    const outputModule: boolean;
}
export namespace optimization {
    const minimize: boolean;
}
export const mode: string;
export const entry: string;
export namespace output {
    const path: any;
    const filename: string;
    namespace library {
        const type: string;
    }
    const globalObject: string;
}
export const devtool: string;
export namespace resolve {
    const extensions: string[];
}
export namespace module {
    const rules: {
        test: RegExp;
        use: {
            loader: string;
        };
        exclude: RegExp;
    }[];
}
export const plugins: CleanWebpackPlugin[];
export namespace externals {
    const vue: string;
    const gsap: string;
    const lodash: string;
    const echarts: string;
}
