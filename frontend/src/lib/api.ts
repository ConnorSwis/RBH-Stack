import { hc } from 'hono/client';
import {type ApiRoutes} from "../../../server/app"
import { queryOptions } from '@tanstack/react-query';

const client = hc<ApiRoutes>("/")

export const api = client.api

async function fetcher<T>(coroutine: Promise<{ json: () => Promise<T>; ok: boolean }>): Promise<T> {
    const result = await coroutine;
    if (!result.ok) {
        throw new Error('server error');
    }
    return await result.json();
}

export async function getCurrentUser() {
    return await fetcher(api.me.$get())
}

export async function getAllExpenses() {
    return await fetcher(api.expenses.$get())
}

export async function getTotalSpent() {
    return await fetcher(api.expenses['total-spent'].$get())
}

export async function createExpense(data: {userId: string, title: string, amount: string}) {
    return await fetcher(api.expenses.$post({json: data}))
}

export const userQueryOptions = queryOptions({
    queryKey: ['get-current-user'],
    staleTime: Infinity ,
    queryFn: getCurrentUser,
});
