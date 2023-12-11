import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';

import { fetchData, postData, updateData } from 'src/utils';
import { fToNow } from 'src/utils/format-time';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

// websocket
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import axios from "axios";

// ----------------------------------------------------------------------


export default function NotificationsPopover() {
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);
  const [totalUnRead, setTotalUnRead] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showAllNotifications, setShowAllNotifications] = useState(false);

  const handleToggleNotifications = () => {
    setShowAllNotifications(!showAllNotifications);
  };
  

  const user = JSON.parse(localStorage.getItem('user'));
  console.log(user.id);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const init = async () => {
        const res = await fetchData(`users/notifications/${user.id}`);
        console.log("Notifications fetched");
        const notifications = res;
        console.log("Notification: ", notifications);
        const notificationsData = [];
        for (const notification of notifications) {
          // get notification's avatar

          const image = await axios.get(`${import.meta.env.VITE_APP_SERVER_URL}:8080/vines/notificationImage/${notification.id}`, {
            responseType: 'arraybuffer',
          })
          .then((response) => {
            let image = btoa(
              new Uint8Array(response.data)
                .reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            return `data:;base64,${image}`;
          });

          // console.log("Notification Teste: ",notification);
          notificationsData.push({
            id: notification.id,
            title: await fetchData(`vines/name/${notification.vineId}`),
            description: notification.description,
            type: '',
            isUnRead: notification.isUnRead,
            createdAt: notification.date,
            avatar: image,
          });
        }


        const unread = notificationsData.filter((item) => item.isUnRead);
        const read = notificationsData.filter((item) => !item.isUnRead);

        setTotalUnRead(unread.length);

        setUnreadNotifications(unread);
        setReadNotifications(read);
        setNotifications(notificationsData);
        }
    init();
  }, []);


  // websocket
  const [latestNotification, setLatestNotification] = useState(null);
  useEffect(() => {
    const ws = new SockJS(`${import.meta.env.VITE_APP_SERVER_URL}:8080/vt_ws`);
    const client = Stomp.over(ws);

    const onMessageReceived = async (data) => {
      const newNotification = JSON.parse(data.body);
      console.log("New Notification in JSON: ", newNotification);

      // Check if the id is defined before processing the notification
      // if (newNotification.id !== undefined) {
        const image = await axios.get(`${import.meta.env.VITE_APP_SERVER_URL}:8080/vines/notificationImage/${newNotification.id}`, {
          responseType: 'arraybuffer',
        })
        .then((response) => {
          let image = btoa(
            new Uint8Array(response.data)
              .reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
          return `data:;base64,${image}`;
        });

        const newFormattedNotification = {
          id: newNotification.id,
          vineId: newNotification.vineId,
          title: await fetchData(`vines/name/${newNotification.vineId}`),
          description: newNotification.description,
          type: '',
          isUnRead: newNotification.isUnRead,
          createdAt: newNotification.date,
          avatar: image,
        };

        setLatestNotification(newFormattedNotification);
        console.log("New Notification: ", newFormattedNotification);

        console.log("Notifications: ", notifications);

        // from notifications list get the ones that are read
        setReadNotifications(notifications.filter((notification) => !notification.isUnRead));
        


        // Use a function to avoid duplicate notifications
        setUnreadNotifications((prevUnread) => {
          // Check if the notification with the same id already exists


            // if its in the read list, remove it from there
            // console.log("Descpription: ", newFormattedNotification.description);
            console.log("Notifications Read: ", readNotifications);
            if (readNotifications.some((notification) => ((notification.avatar === newFormattedNotification.avatar) && (notification.vineId === newFormattedNotification.vineId)))) {
              setReadNotifications((prevRead) =>
                prevRead.filter((notification) => !((notification.avatar === newFormattedNotification.avatar) && (notification.vineId === newFormattedNotification.vineId)))
              );

              setNotifications((prevNotifications) => 
                prevNotifications.filter((notification) => !((notification.avatar === newFormattedNotification.avatar) && (notification.vineId === newFormattedNotification.vineId)))
              );

              console.log("Notification removed from read list");
            }

            // check if the notification is already in the unread list
            if (prevUnread.some((notification) => ((notification.avatar === newFormattedNotification.avatar) && (notification.vineId === newFormattedNotification.vineId)))) {
              console.log("IT WENT HERE");
              return prevUnread;
            }

            setNotifications((prevNotifications) => [newFormattedNotification, ...prevNotifications]);
            console.log("Notification added to notifications list: " , notifications);
            setTotalUnRead((prevTotal) => prevTotal + 1);
            return [newFormattedNotification, ...prevUnread];

        });

    
      // }
    };

    client.connect({}, function () {
      const subscription = client.subscribe('/topic/notification', onMessageReceived);

      // Cleanup function
      return () => {
        subscription.unsubscribe();
        client.disconnect();
      };
    });
  }, [notifications]);



  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setShowAllNotifications(false);
    setOpen(null);
  };

  const handleMarkAllAsRead = () => {
    unreadNotifications.forEach((notification) => markNotificationAsRead(notification.id));
    setUnreadNotifications([]);
    setTotalUnRead(0);
  };

  const handleMarkAsRead = (notificationId) => {

    setUnreadNotifications((prevUnread) =>
    prevUnread.filter((notification) => notification.id !== notificationId)
    );

    markNotificationAsRead(notificationId);

  };

  const markNotificationAsRead = (notificationId) => {
    updateData(`users/markAsRead/${notificationId}`, null);

    setTotalUnRead((prevTotal) => prevTotal - 1);

    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === notificationId ? { ...notification, isUnRead: false } : notification
      )
    );



    setReadNotifications((prevRead) => [
      unreadNotifications.find((notification) => notification.id === notificationId),
      ...prevRead,
    ]);
  };

  return (
    <>
      <IconButton color={open ? 'primary' : 'default'} onClick={handleOpen}>
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify width={24} icon="solar:bell-bing-bold-duotone" />
        </Badge>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            ml: 0.75,
            width: 360,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {totalUnRead} unread messages
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
        <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                New
              </ListSubheader>
            }
          >
            {unreadNotifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} markAsRead={handleMarkAsRead}/>
            ))}
          </List>

          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                Read
              </ListSubheader>
            }
          >
            {readNotifications.slice(0, showAllNotifications ? readNotifications.length : 2).map((notification) => (
              <NotificationItem 
                key={notification.id} 
                notification={notification} 
                markAsRead={handleMarkAsRead}
              />
            ))}
          </List>

        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple onClick={handleToggleNotifications}>
            {showAllNotifications ? 'Show Less' : 'View All'}
          </Button>
        </Box>
      </Popover>
    </>
  );
}

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    createdAt: PropTypes.instanceOf(Date),
    id: PropTypes.string,
    isUnRead: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
    avatar: PropTypes.any,
  }),
  markAsRead: PropTypes.func,
};

function NotificationItem({ notification, markAsRead }) {
  const { avatar, title } = renderContent(notification);

  const handleClick = () => {
    if (notification.isUnRead) {
      markAsRead(notification.id);
    }
  };

  return (
    <ListItemButton
      onClick={handleClick}
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.isUnRead && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
            {fToNow(new Date(notification.createdAt))}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification) {
  const title = (
    <Typography variant="subtitle2">
      {notification.title}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {notification.description}
      </Typography>
    </Typography>
  );

  if (notification.type === 'order_placed') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/ic_notification_package.svg" />,
      title,
    };
  }
  if (notification.type === 'order_shipped') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/ic_notification_shipping.svg" />,
      title,
    };
  }
  if (notification.type === 'mail') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/ic_notification_mail.svg" />,
      title,
    };
  }
  if (notification.type === 'chat_message') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/ic_notification_chat.svg" />,
      title,
    };
  }
  return {
    avatar: notification.avatar ? <img alt={notification.title} src={notification.avatar} /> : null,
    title,
  };
}