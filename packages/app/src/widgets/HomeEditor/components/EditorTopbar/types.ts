export enum PlanActionsEnum {
    Save = 'save',
    Settings = 'settings',
    Export = 'export',
    Import = 'import',
    ExitToView = 'exitToView',
    SyncDevices = 'syncDevices',
}

export type PlanActionEvent = {
    type: PlanActionsEnum;
    file?: File;
}

export type EditorTopbarProps = {
    actionsInProgress: PlanActionsEnum[];
    onItemClick: (e: PlanActionEvent) => void;
}