import {SessionType} from "@/type/system";
import {fetcher} from "@/utils/axios";
import {useMemo} from "react";
import useSWR from "swr";

export function GetSessions() {

	const {data, isLoading, error, mutate} = useSWR(`/sessions?populate=*`, fetcher,{
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

	const {data, isLoading, error, mutate} = useSWR(`/sessions/${id}?populate=*`, fetcher,{
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