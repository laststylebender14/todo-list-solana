import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { TodoList } from "../target/types/todo_list";
import { expect } from "chai";

describe("Todo List Program", () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.todoList as Program<TodoList>;
  const wallet = anchor.workspace.TodoList.provider.wallet;

  // Helper function to create a PDA for a todo
  const createPDA = (key: string) =>
    anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("todo"), wallet.publicKey.toBuffer(), Buffer.from(key)],
      program.programId
    );

  // Helper function to create a test todo
  const createTodo = async (title: string, description: string) => {
    const [todoPDA] = createPDA(title);

    await program.methods
      .createTodo(title, description)
      .accounts({
        todo: todoPDA,
        authority: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    return { todoPDA };
  };

  const markComplete = async (title: string) => {
    const [todoPDA] = createPDA(title);
    return await program.methods
      .completeTodo()
      .accounts({
        todo: todoPDA,
        authority: wallet.publicKey,
      })
      .signers([])
      .rpc();
  }

  describe("createTodo", () => {
    it("should create a new todo with valid parameters", async () => {
      const title = "test-title";
      const description = "This is a test description";

      // Create a new todo
      const { todoPDA } = await createTodo(title, description);
      // Fetch the created todo account
      const todoAccount = await program.account.todo.fetch(todoPDA);

      // Verify the todo was created with the correct data
      expect(todoAccount.title).to.equal(title);
      expect(todoAccount.description).to.equal(description);
      expect(todoAccount.authority.equals(wallet.publicKey)).to.be.true;
    });
  });

  describe("mark todo complete", () => {
    it("should mark a todo as complete", async () => {
      const title = "complete-test";
      const { todoPDA } = await createTodo(title, "Todo to complete");

      // Verify the todo exists before deletion
      let todoAccount = await program.account.todo.fetch(todoPDA);
      expect(todoAccount.title).to.equal(title);

      // Mark the todo as complete
      await markComplete(title);

      // Verify the todo account no longer exists
      try {
        await program.account.todo.fetch(todoPDA);
        expect.fail("Todo account should no longer exist");
      } catch (error) {
        expect(error.toString()).to.include("Account does not exist");
      }
    });
  });
});
