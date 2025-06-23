import React from "react"
import { TaskStatus } from "../features/scheduler/SchedulerAPI"
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  HourglassOutlined,
  SyncOutlined,
  StopOutlined
} from "@ant-design/icons"


export const statusLabels: Record<TaskStatus, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  waiting: 'Waiting',
  canceled: 'Canceled',
  done: 'Done'
}

export const statusColors: Record<TaskStatus, string> = {
  not_started: 'default',
  in_progress: 'blue',
  waiting: 'orange',
  canceled: 'red',
  done: 'green'
}

export const statusIcons: Record<TaskStatus, React.ReactNode> = {
  not_started: React.createElement(ClockCircleOutlined),
  in_progress: React.createElement(SyncOutlined),
  waiting: React.createElement(HourglassOutlined),
  canceled: React.createElement(StopOutlined),
  done: React.createElement(CheckCircleOutlined)
}