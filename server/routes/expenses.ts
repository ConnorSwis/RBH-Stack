import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { getUser } from "../kinde";
import { userAddExpense, userExpenses } from "../db/tables/expenses";
import { use } from "hono/jsx";



const fakeExpenses = [
    {
        id: 1,
        title: "Rent",
        amount: "1000"
    },
    {
        id: 2,
        title: "Food",
        amount: "100"
    }
];

// const expenseSchema = z.object({
//     id: z.number().int().positive().min(1),
//     title: z.string().min(1).max(255),
//     amount: z.string()
// });

const expenseSchema = z.object({
    id: z.number().int().positive().min(1),
    title: z.string().min(1).max(255),
    amount: z.string(),
    userId: z.string()
});

type Expense = z.infer<typeof expenseSchema>;
const userAddExpenseSchema = expenseSchema.omit({ id: true });



const createPostSchema = expenseSchema.omit({ id: true });

export const expensesRoute = new Hono()

    .get("/", getUser, async c => {
        const expenses = await userExpenses(c.var.user.id);
        return c.json({ expenses });
    })

    .post("/", getUser, zValidator("json", createPostSchema), async c => {
        const expenseInputData = c.req.valid("json")
        const expense = await userAddExpense({ ...expenseInputData, userId: c.var.user.id });
        c.status(201)
        return c.json({ expense })
    })

    .get("/:id{[0-9]+}", getUser, c => {
        const id = parseInt(c.req.param("id"))
        const expense = fakeExpenses.find(e => e.id === id)
        if (!expense) {
            return c.notFound()
        }
        return c.json({ expense })
    })

    .delete("/:id{[0-9]+}", getUser, c => {
        const id = parseInt(c.req.param("id"))
        const index = fakeExpenses.findIndex(e => e.id === id)
        if (!index) {
            return c.notFound()
        }
        const deletedExpense = fakeExpenses.splice(index, 1)[0];
        return c.json({ expense: deletedExpense })
    })

    .get("/total-spent", getUser, async c => {
        const expenses = await userExpenses(c.var.user.id);
        const total = expenses.reduce((acc, e) => acc + parseInt(e.amount), 0);
        return c.json({ total })
    });