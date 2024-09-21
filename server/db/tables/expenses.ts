import { expensesSchema } from "../schema/expenses";
import { db } from "../index";
import { and, eq, sum } from "drizzle-orm";
import { z } from "zod";

const expenseSchema = z.object({
    id: z.number().int().positive().min(1),
    title: z.string().min(1).max(255),
    amount: z.string(),
    userId: z.string(),
    createdAt: z.date()
});

export type Expense = z.infer<typeof expenseSchema>;

const addExpenseSchema = expenseSchema.omit({ id: true, createdAt: true });
type AddExpense = z.infer<typeof addExpenseSchema>;

export async function userExpenses(userId: string): Promise<Expense[]> {
    const expenses = await db
        .select()
        .from(expensesSchema)
        .where(eq(expensesSchema.userId, userId));
    return expenses;
}

export async function userExpenseById(id: number, userId: string): Promise<Expense | null> {
    const expense = await db
        .select()
        .from(expensesSchema)
        .where(and(
            eq(expensesSchema.id, id),
            eq(expensesSchema.userId, userId)))
        .limit(1);
    if (!expense) {
        return null;
    }
    return expense[0];
}

export async function userAddExpense(values: AddExpense): Promise<Expense | null> {
    const expense = await db
        .insert(expensesSchema)
        .values(values)
        .returning();
    return expense[0];
}

export async function userDeleteExpense(values: { id: number, userId: string }): Promise<Expense | null> {
    const expense = await db
        .delete(expensesSchema)
        .where(and(eq(expensesSchema.id, values.id), eq(expensesSchema.userId, values.userId)))
        .returning()
        ;
    if (!expense) {
        return null;
    }
    return expense[0];
}

export async function userTotalSpent(userId: string) {
    const total = await db
        .select({ total: sum(expensesSchema.amount) })
        .from(expensesSchema)
        .where(eq(expensesSchema.userId, userId)).then(res => res[0]);
    if (!total) {
        return null;
    }
    return total.total;
}