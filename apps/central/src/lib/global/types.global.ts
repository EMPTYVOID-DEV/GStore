export type Permissions =
	| 'create'
	| 'read'
	| 'delete'
	| 'update'
	| 'list-files'
	| 'apply-transformation';

export type Operations = 'create' | 'read' | 'delete' | 'update' | 'apply-transformation';

export type ActionStatus = {
	state: 'valid' | 'invalid';
	errorMsg: string;
};
