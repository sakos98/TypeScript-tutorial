const inquirer = require('inquirer');

enum Action {
  List = "list",
  Add = "add",
  Remove = "remove",
  Quit = "quit"
}

type InquirerAnswers = {
  action: Action;
};

enum MessageVariant {
  Success = 'success',
  Error = 'error',
  Info = 'info',
}

class Message {
  public static showColorized(variant: string, text: string): void {
    console.log(`[${variant}] ${text}`);
  }
}

interface User {
  name: string;
  age: number;
}

class UsersData {
  private data: User[] = [];

  public showAll(): void {
    if (this.data.length === 0) {
      Message.showColorized(MessageVariant.Info, 'No data...');
    } else {
      Message.showColorized(MessageVariant.Info, 'Users data');
      console.table(this.data);
    }
  }

  public add(user: User): void {
    if (user.age > 0 && user.name.length > 0) {
      this.data.push(user);
      Message.showColorized(MessageVariant.Success, 'User has been successfully added!');
    } else {
      Message.showColorized(MessageVariant.Error, 'Wrong data!');
    }
  }

  public remove(userName: string): void {
    const index = this.data.findIndex((user) => user.name === userName);
    if (index !== -1) {
      this.data.splice(index, 1);
      Message.showColorized(MessageVariant.Success, 'User deleted!');
    } else {
      Message.showColorized(MessageVariant.Error, 'User not found...');
    }
  }
}

const users = new UsersData();

const startApp = () => {
  inquirer.prompt([{
    name: 'action',
    type: 'input',
    message: 'How can I help you?',
  }]).then(async (answers: InquirerAnswers) => {
    switch (answers.action) {
      case Action.List:
        users.showAll();
        startApp();
        break;
      case Action.Add:
        inquirer.prompt([{
          name: 'name',
          type: 'input',
          message: 'Enter name',
        }, {
          name: 'age',
          type: 'number',
          message: 'Enter age',
        }]).then((user: User) => {
          users.add(user);
          startApp();
        });
        break;
      case Action.Remove:
        inquirer.prompt([{
          name: 'name',
          type: 'input',
          message: 'Enter name',
        }]).then((name: { name: string }) => {
          users.remove(name.name);
          startApp();
        });
        break;
      case Action.Quit:
        Message.showColorized(MessageVariant.Info, "Bye bye!");
        return;
      default:
        Message.showColorized(MessageVariant.Error, "Unknown action!");
        startApp();
    }
  });
};

console.log("\n");
console.info("👋 Welcome to the UsersApp!");
console.log("====================================");
Message.showColorized(MessageVariant.Info, "Available actions");
console.log("\n");
console.log("list – show all users");
console.log("add – add a new user to the list");
console.log("remove – remove a user from the list");
console.log("quit – quit the app");
console.log("\n");

startApp();
