# Todo List Solana Program

A Solana on-chain todo list program built with Anchor. This program allows users to create, complete, and delete todos on the Solana blockchain.

## Features

- Create a new todo with title, description, and status
- Mark a todo as completed
- Delete a todo
- All todos are stored on-chain and associated with the user's wallet

## Prerequisites

- [Rust](https://www.rust-lang.org/tools/install)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)
- [Anchor](https://www.anchor-lang.com/docs/installation)
- [Yarn](https://yarnpkg.com/) or npm

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd todo_list
   ```

2. Install dependencies:
   ```bash
   yarn install
   # or
   npm install
   ```

3. Build the program:
   ```bash
   anchor build
   ```

4. Update the program ID in the `Anchor.toml` and `lib.rs` if needed.

## Testing

Run the test suite:

```bash
anchor test
```

This will:
1. Start a local validator
2. Deploy the program
3. Run the test suite

## Program Interface

### Instructions

1. **Create a Todo**
   ```rust
   pub fn create_todo(
       ctx: Context<CreateTodo>,
       title: String,
       description: String,
       status: Status,
   ) -> Result<()>
   ```

2. **Complete a Todo**
   ```rust
   pub fn complete_todo(ctx: Context<CompleteTodo>) -> Result<()>
   ```

3. **Delete a Todo**
   ```rust
   pub fn delete_todo(ctx: Context<DeleteTodo>) -> Result<()>
   ```

### Account Structures

#### Todo Account
```rust
pub struct Todo {
    pub authority: Pubkey,
    pub title: String,       // Max 50 chars
    pub description: String,  // Max 50 chars
    pub status: Status,
    pub bump: u8,
}

pub enum Status {
    Started,
    UnStarted,
    Finished,
}
```

## Usage Example

Here's how you can interact with the program using the Anchor TypeScript client:

```typescript
// Create a new todo
const { todoPDA } = await program.methods
  .createTodo("My Todo", "Description here", { started: {} })
  .accounts({
    todo: todoPDA,
    authority: wallet.publicKey,
    systemProgram: anchor.web3.SystemProgram.programId,
  })
  .rpc();

// Complete a todo
await program.methods
  .completeTodo()
  .accounts({
    todo: todoPDA,
    authority: wallet.publicKey,
  })
  .rpc();

// Delete a todo
await program.methods
  .deleteTodo()
  .accounts({
    todo: todoPDA,
    authority: wallet.publicKey,
  })
  .rpc();
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
