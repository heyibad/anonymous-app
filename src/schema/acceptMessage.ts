import {z } from "zod";

export const isAcceptingMassages = z.object({
    isAcceptingMassages: z.boolean(),
})