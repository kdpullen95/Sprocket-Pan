import { AuditLogManager } from '@/managers/AuditLogManager';
import type { AuditLog, RequestEvent } from '@/types/data/audit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export type AuditLogState = Map<string, AuditLog>;
const initialAuditLogSliceState: AuditLogState = new Map();
type UpdateAuditLogPayload = {
	chronology: RequestEvent['chronology'];
	eventType: RequestEvent['eventType'];
	eventId: string;
	associatedId?: string;
	error?: string;
};
export const AuditLogSlice = createSlice({
	name: 'auditLog',
	initialState: initialAuditLogSliceState,
	reducers: {
		addToAuditLog: (state, action: PayloadAction<UpdateAuditLogPayload>) => {
			let auditLog = state.get(action.payload.eventId);
			if (auditLog == undefined) {
				auditLog = [];
				state.set(action.payload.eventId, auditLog);
			}
			AuditLogManager.addToAuditLog(
				auditLog,
				action.payload.chronology,
				action.payload.eventType,
				action.payload.associatedId,
			);
		},
		clearAuditLogEntry: (state, action: PayloadAction<string>) => {
			state.delete(action.payload);
		},
	},
});

export const AuditActions = AuditLogSlice.actions;
