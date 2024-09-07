import { AppInterface } from '@khanonjs/engine';
export declare class LPWebsite extends AppInterface {
    onStart(): void;
    onClose(): void;
    onError(error?: string): void;
}
