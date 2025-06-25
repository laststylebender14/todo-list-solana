use anchor_lang::prelude::*;

declare_id!("DJHFg2MjK7x654nDzP8x36B5wDiF2i6ckGR9jieBgcdt");

#[program]
pub mod todo_list {
    use super::*;

    pub fn create_todo(
        ctx: Context<CreateTodo>,
        title: String,
        description: String,
    ) -> Result<()> {
        ctx.accounts.todo.authority = ctx.accounts.authority.key();
        ctx.accounts.todo.title = title;
        ctx.accounts.todo.description = description;
        ctx.accounts.todo.bump = ctx.bumps.todo;
        Ok(())
    }

    pub fn complete_todo(_ctx: Context<CompleteTodo>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct CreateTodo<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(init, space= 8 + Todo::INIT_SPACE,payer=authority, seeds=[b"todo", authority.key().as_ref(),title.as_bytes()], bump)]
    pub todo: Account<'info, Todo>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CompleteTodo<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(mut, seeds=[b"todo", authority.key().as_ref(), todo.title.as_bytes()], bump=todo.bump, has_one=authority, close=authority)]
    pub todo: Account<'info, Todo>,
}

#[account]
#[derive(InitSpace)]
pub struct Todo {
    pub authority: Pubkey,
    #[max_len(50)]
    pub title: String,
    #[max_len(50)]
    pub description: String,
    pub bump: u8,
}
