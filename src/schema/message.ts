import {z } from "zod";

export const massage = z.object({
conteny:z
.string()
.min(6,"massage must be at least 6 characters long")
.max(255,"massage must be at most 255 characters long"),
})