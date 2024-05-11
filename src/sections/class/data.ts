import {ClassType} from "@/type/system";
import {fetcher} from "@/utils/axios";
import {useMemo} from "react";
import useSWR from "swr";

export function GetClasses() {

	const {data, isLoading, error, mutate} = useSWR(
		`/classes?populate=*`,
		fetcher, {
			revalidateIfStale: false,
			revalidateOnFocus: false,
			revalidateOnReconnect: false
		})

	const memoizedValue = useMemo(
		() => ( {
			data: ( data?.data as { attributes: ClassType, id: number }[] ) || null,
			isLoading: isLoading,
			error: error,
		} ),
		[data, isLoading, error],
	);

	return {memoizedValue, mutate};
}

export function GetClassByID(id: number) {

	const {data, isLoading, error, mutate} = useSWR(
		`/classes/${id}?populate[students][populate][avatar]=*&populate[sessions]=*&populate[students][populate][avatars]=*`,
		fetcher, {
			revalidateIfStale: false,
			revalidateOnFocus: false,
			revalidateOnReconnect: false
		})

	const memoizedValue = useMemo(
		() => ( {
			data: ( data?.data as { attributes: ClassType, id: number } ) || null,
			isLoading: isLoading,
			error: error,
		} ),
		[data, isLoading, error],
	);

	return {memoizedValue, mutate};
}