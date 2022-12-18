import { Router } from 'express';
import CreateReminderDto from '../dtos/create-reminder';
import Reminder from '../models/reminder';

type ReminderObj = { id: number; title: string; isComplete: boolean };

const router = Router();
const reminders: Reminder[] = [];

router.get('/', (req, res) => {
  if (!reminders.length) {
    return res.status(200).json({ success: false, message: 'No reminders found' });
  }

  res.status(200).json({ result: reminders.length, data: reminders });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: 'No id found in request' });
  }

  const reminder = reminders.find((reminder: ReminderObj) => {
    return reminder.id === parseInt(id);
  });

  if (!reminder) {
    return res.status(404).json({
      success: false,
      message: `No reminder found with this ID: ${id}`,
    });
  }

  res.status(200).json({
    success: true,
    data: reminder,
  });
});

router.patch('/:id', (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: 'No id found in request' });
  }

  const reminder = reminders.find((reminder: ReminderObj) => {
    return reminder.id === parseInt(id);
  });

  if (!reminder) {
    return res.status(404).json({
      success: false,
      message: `No reminder found with this ID: ${id}`,
    });
  }

  const { title, isComplete } = req.body as ReminderObj;

  if (title && typeof title !== 'string') {
    return res.status(400).json({ success: false, message: 'Reminder title should be string only' });
  } else if (isComplete && typeof isComplete !== 'boolean') {
    return res.status(400).json({ success: false, message: 'Complete status of reminder should be a boolean value' });
  }

  reminder.title = title ? title : reminder.title;
  reminder.isComplete = isComplete ? isComplete : reminder.isComplete;

  res.status(200).json({
    success: true,
    message: 'Reminder updated',
    reminder: reminder,
  });
});

router.post('/', (req, res) => {
  const { title } = req.body as CreateReminderDto;
  const reminder = new Reminder(title);

  reminders.push(reminder);
  res.status(201).json(reminder);
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: 'No id found in request' });
  }

  const reminderIndex = reminders.findIndex((reminder: ReminderObj) => {
    return reminder.id === parseInt(id);
  });

  if (reminderIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `No reminder found with this ID: ${id}`,
    });
  }

  reminders.splice(reminderIndex, 1);

  res.status(200).json({ success: true, message: 'Reminder deleted' });
});

export default router;
