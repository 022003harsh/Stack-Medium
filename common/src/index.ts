import z from "zod";

export const signUpInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
})

export const signInInput = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

export const createBlogInput = z.object({
    title: z.string(),
    content: z.string(),
})

export const updateBlogInput = z.object({
  title: z.string(),
  content: z.string(),
  id: z.number(),
});

export type SignUpInputType = z.infer<typeof signUpInput>
export type SignInInputType = z.infer<typeof signInInput>
export type CreateBlogInputType = z.infer<typeof createBlogInput>
export type UpdateBlogInputType = z.infer<typeof updateBlogInput>
