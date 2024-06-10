import { FormEvent, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import MyError from "../interfaces/MyError";
import SavedTask from "../interfaces/SavecTask";

const Main = () => {
  const [taskList, setTaskList] = useState<Array<SavedTask>>([]);
  const [task, setTask] = useState("");
  const [searchedTask, setSearchedTask] = useState("");
  const [taskFinishedList, setTaskFinishedList] = useState<Array<string>>([]);
  const [mode, setMode] = useState("light");

  if (taskList.length === 0) {
    axios
      .get("https://site--react-todo-list-backend--x7c7hl9cnzx6.code.run/task")
      .then((response) => {
        setTaskList(
          response.data.message.map(
            (value: {
              _id: string;
              task: string;
              finished: boolean;
              __v: number;
            }) => {
              return { id: value._id, task: value.task };
            }
          )
        );
        setTaskFinishedList(
          response.data.message
            .filter(
              (value: {
                _id: string;
                task: string;
                finished: boolean;
                __v: number;
              }) => {
                return value.finished;
              }
            )
            .map(
              (value: {
                _id: string;
                task: string;
                finished: boolean;
                __v: number;
              }) => {
                return value._id;
              }
            )
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (task.length > 0) {
      try {
        const response = await axios.post(
          "https://site--react-todo-list-backend--x7c7hl9cnzx6.code.run/task",
          {
            task: task,
          }
        );
        const { responseTask = task, _id } = response.data.message;
        setTaskList([...taskList, { task: responseTask, id: _id }]);
        setTask("");
      } catch (error) {
        console.log((error as MyError).message);
      }
    }
  };

  const handleDeleteClick = async (id: string) => {
    try {
      await axios.delete(
        "https://site--react-todo-list-backend--x7c7hl9cnzx6.code.run/task/" +
          id
      );
      const newTaskList = taskList.filter((task) => {
        return task.id !== id;
      });
      setTaskList(newTaskList);
    } catch (error) {
      console.log((error as MyError).message);
    }
  };

  const handleFinishClick = async (id: string) => {
    const filteredTab = taskFinishedList.filter((_id) => {
      return _id === id;
    });

    try {
      await axios.patch(
        "https://site--react-todo-list-backend--x7c7hl9cnzx6.code.run/task/" +
          id +
          "?finished=" +
          (filteredTab.length === 0)
      );

      if (filteredTab.length === 0) {
        setTaskFinishedList([...taskFinishedList, id]);
      } else {
        const newTaskFinishedList = [...taskFinishedList];
        const index = newTaskFinishedList.indexOf(id);
        newTaskFinishedList.splice(index, 1);
        setTaskFinishedList(newTaskFinishedList);
      }
    } catch (error) {
      console.log((error as MyError).message);
    }
  };

  return (
    <main className={mode === "dark" ? "dark" : ""}>
      <div className="tasks">
        {taskList
          .sort((task1, task2) => {
            if (
              taskFinishedList.includes(task1.id) &&
              !taskFinishedList.includes(task2.id)
            ) {
              return 1;
            } else {
              return -1;
            }
          })
          .filter((task) => {
            return task.task.includes(searchedTask);
          })
          .map((task) => {
            return (
              <article className="task" key={task.id}>
                <FontAwesomeIcon
                  icon={
                    taskFinishedList.includes(task.id)
                      ? "square-check"
                      : "square"
                  }
                  className="square"
                  onClick={() => {
                    handleFinishClick(task.id);
                  }}
                />
                <p
                  className={
                    "task-description " +
                    (taskFinishedList.includes(task.id) ? "line-through" : "")
                  }
                >
                  {task.task}
                </p>
                <FontAwesomeIcon
                  icon={"trash"}
                  className="trash"
                  onClick={() => {
                    handleDeleteClick(task.id);
                  }}
                />
              </article>
            );
          })}
      </div>
      <div>
        <form className="add-task-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="task"
            placeholder="new task"
            onChange={(event) => {
              setTask(event.target.value);
            }}
            value={task}
          />
          <input type="submit" placeholder="Add task" />
        </form>
      </div>
      <div className="search-task">
        <input
          type="text"
          placeholder="search task"
          value={searchedTask}
          onChange={(event) => {
            setSearchedTask(event.target.value);
          }}
        />
      </div>
      <div className="mode">
        <input
          type="text"
          list="mode"
          value={mode}
          onChange={(event) => {
            setMode(event.target.value);
          }}
        />
        <datalist id="mode">
          <option value="light"></option>
          <option value="dark"></option>
        </datalist>
      </div>
    </main>
  );
};

export default Main;
