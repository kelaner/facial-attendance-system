import {SessionType} from "@/type/system";
import axiosInstance, {fetcher} from "@/utils/axios";
import {useMemo} from "react";
import useSWR from "swr";

export function GetSessions() {

	const {data, isLoading, error, mutate} = useSWR(`/sessions?populate=*`, fetcher, {
		revalidateIfStale: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: false
	})

	const memoizedValue = useMemo(
		() => ( {
			data: ( data?.data as { attributes: SessionType, id: number }[] ) || null,
			isLoading: isLoading,
			error: error,
		} ),
		[data, isLoading, error],
	);

	return {memoizedValue, mutate};
}

export function GetSessionByID(id: number) {

	const {data, isLoading, error, mutate} = useSWR(
		`/sessions/${id}?populate[complete_students][populate][avatar]=*&populate[classes]=*`,
		fetcher, {
			revalidateIfStale: false,
			revalidateOnFocus: false,
			revalidateOnReconnect: false
		})

	const memoizedValue = useMemo(
		() => ( {
			data: ( data?.data as { attributes: SessionType, id: number } ) || null,
			isLoading: isLoading,
			error: error,
		} ),
		[data, isLoading, error],
	);

	return {memoizedValue, mutate};
}

export function PutStudentInSessionByID(session_id: number, student_id: number, existingStudents: number[]) {

	return axiosInstance.put(`/sessions/${session_id}`, {
		data: {
			complete_students: {
				connect: [...existingStudents, student_id]
			}
		}
	})
}

export function PutChangeSessionStatusByID(session_id: number, status: boolean) {

	return axiosInstance.put(`/sessions/${session_id}`, {
		data: {
			complete_students: {
				completed: status
			}
		}
	})
}