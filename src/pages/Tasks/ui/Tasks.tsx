import clsx from "clsx";
import { ArrowRightIcon } from "../../../components/Icons/ArrowRightIcon";
import s from "./Tasks.module.scss";
import { useEffect, useState } from "react";
import { apiService } from "../../../api";
import { ThisInviteLinkIcon } from "../../../components/Icons/ThisInviteLinkIcon";
import { Link } from "react-router-dom";
import { TaskRead } from "../../../types/tasks";

export const Tasks = () => {
  const [tasks, setTasks] = useState<TaskRead[]>([]);
  const [completedTasks, setCompletedTasks] = useState<TaskRead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasks = (await apiService.getTasks()).data;
        setTasks(tasks);

        const completedTasks = (await apiService.getCompletedTasks()).data;
        setCompletedTasks(completedTasks);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) return <div>Loading...</div>;

  const handleCompleteTask = async (task: TaskRead) => {
    try {
      await apiService.completeTask(task.task_id);

      const updatedTasks = (await apiService.getTasks()).data;
      setTasks(updatedTasks);

      const updatedCompletedTasks = (await apiService.getCompletedTasks()).data;
      setCompletedTasks(updatedCompletedTasks);
    } catch (error) {}
  };

  const completedTaskIds = new Set(completedTasks.map((task) => task.task_id));

  return (
    <div className={s.wrapper}>
      <div className={s.block}>
        <div className={s.block_title}>tasks:</div>
        <div className={s.block_items}>
          {tasks.filter((task) => !completedTaskIds.has(task.task_id)).length >
          0 ? (
            tasks.map((task, index) => (
              <Link
                to={task.link}
                className={s.block_item}
                key={index}
                onClick={() => handleCompleteTask(task)}
              >
                <div className={s.block_item_l}>{task.name}</div>
                <div className={s.block_item_r}>
                  <ArrowRightIcon />
                </div>
              </Link>
            ))
          ) : (
            <div className={s.no_referrals}>No tasks yet</div>
          )}
        </div>
      </div>
      <div className={s.block}>
        <div className={s.block_title}>completed tasks:</div>
        <div className={clsx(s.block_items, s.pink)}>
          {completedTasks.length > 0 ? (
            completedTasks.map((task, index) => (
              <Link to={task.link} className={s.block_item} key={index}>
                <div className={s.block_item_l}>{task.name}</div>
                <div className={s.block_item_r}>
                  <ThisInviteLinkIcon />
                </div>
              </Link>
            ))
          ) : (
            <div className={s.no_referrals}>No completed tasks yet</div>
          )}
        </div>
      </div>
    </div>
  );
};
