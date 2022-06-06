import {User} from "../../core/models/user";

export class Document {
    id?: number;
    path?: string;
    file?: string;
    file_name?: string;
    revision?: number;
    current_revision?: boolean;
    user?: User;
    uploaded_at?: Date;
}
