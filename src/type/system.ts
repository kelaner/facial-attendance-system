export interface ClassType {
	name: string,
	uid: string,
	students?: {
		data: {
			id: number,
			attributes: StudentType
		}[ ]
	},
	sessions?: {
		data: {
			id: number,
			attributes: SessionType
		}[ ]
	},
}

export interface ClassWithIDType extends ClassType {
	id: number
}

export interface SessionType {
	name: string,
	uid: string,
	completed?: boolean,
	start_time?: string,
	end_time?: string,
	complete_students?: {
		data: {
			id: number,
			attributes: StudentType
		}[ ]
	},
	classes?: {
		data: {
			id: number,
			attributes: ClassType
		}[ ]
	},
}

export interface SessionWithIDType extends SessionType {
	id: number
}

export interface StudentType {
	name: string,
	avatar: string,
	uid: string,
	gender?: "undefined" | "male" | "female",
	classes?: {
		data: {
			id: number,
			attributes: ClassType
		}[ ]
	},
	complete_sessions?: {
		data: {
			id: number,
			attributes: SessionType
		}[ ]
	},
}

