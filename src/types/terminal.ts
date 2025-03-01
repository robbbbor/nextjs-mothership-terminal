export interface TerminalConfig {
    name: string;
    author: string;
}

export interface LinkTarget {
    target: string;
    type: 'dialog' | 'link';
    shiftKey?: boolean;
}

export interface ContentItem {
    type?: 'text' | 'link' | 'bitmap' | 'prompt' | 'toggle';
    text?: string;
    target?: string | LinkTarget[];
    className?: string;
    src?: string;
    prompt?: string;
    commands?: Command[];
    states?: ToggleState[];
}

export interface Command {
    command: string;
    action: {
        type: string;
        target: string;
    };
}

export interface ToggleState {
    active: boolean;
    text: string;
}

export interface Screen {
    id: string;
    type: 'screen';
    content: (string | ContentItem)[];
}

export interface Dialog {
    id: string;
    type: 'alert';
    content: string[];
}

export interface TerminalData {
    config: TerminalConfig;
    screens: Screen[];
    dialogs: Dialog[];
}
