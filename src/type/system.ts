export interface ClassType {
	name: string,
	students: StudentType[],
	sessions: SessionType[],
	uid: string
}

export interface SessionType {
	name: string,
	students: StudentType[],
	classes: ClassType[],
	uid: string,
	completed?: boolean,
	start_time?: string,
	end_time?: string
}

export interface StudentType {
	name: string,
	avatar: string,
	uid: string,
	classes: ClassType[],
	sessions: SessionType[],
	gender?: "undefined" | "male" | "female",
}

