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

  useEffect(() => {
    const res = fetchData(`users/notifications/${user.id}`);
    res.then((response) => {
      if (response) {
        console.log("Notifications fetched");
        console.log(response);

        const notifications = response;
        const notificationsData = notifications.map(async (value) => {
          if (value.vine) {
            console.log("Testing getting the vine name: " ,await fetchData(`vines/name/${value.vineId}`));
            return {
              id: value.id,
              title: await fetchData(`vines/name/${value.vineId}`),
              description: value.description,
              avatar: value.avatar,
              type: '',
              createdAt: new Date(value.date),
              isUnRead: value.isUnRead,
            };
          } else {
            console.error("vineId is undefined for notification:", value);
            return null; // or handle it in a way that makes sense for your application
          }
        });
        

        const unread = notificationsData.filter((item) => item.isUnRead);
        const read = notificationsData.filter((item) => !item.isUnRead);

        setTotalUnRead(unread.length);

        setUnreadNotifications(unread);
        setReadNotifications(read);
        setNotifications(notificationsData);
      } else {
        console.error('Failed to fetch notifications');
      }
    });
  }, []);


  // websocket
  // const [latestNotification, setLatestNotification] = useState(null);
  // useEffect(() => {
  //   const ws = new SockJS("http://localhost:8080/vt_ws");
  //   const client = Stomp.over(ws);
  //   client.connect({}, function () {
  //     client.subscribe('/topic/notification', function (data) {
  //       console.log("New notification: ", JSON.parse(data.body));
  //       setLatestNotification(JSON.parse(data.body));
  //       const newNotifications = [...notifications];
  //       newNotifications.push(JSON.parse(data.body));
  //       console.log("New notifications: ", newNotifications);
  //       setNotifications(newNotifications);
  //     }
  //     );
  //   });
  // }
  //   , [notifications]);




  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleMarkAllAsRead = () => {
    setUnreadNotifications([]);
    setReadNotifications((prevRead) => [
      ...prevRead,
      ...unreadNotifications.map((notification) => ({
        ...notification,
        isUnRead: false,
      })),
    ]);

    unreadNotifications.forEach((notification) => {
      markNotificationAsRead(notification.id);
    });
  };

  const handleMarkAsRead = (notificationId) => {
    setUnreadNotifications((prevUnread) =>
      prevUnread.map((notification) =>
        notification.id === notificationId ? { ...notification, isUnRead: false } : notification
      )
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
      ...prevRead,
      unreadNotifications.find((notification) => notification.id === notificationId),
    ]);

    setUnreadNotifications((prevUnread) => prevUnread.filter((notification) => notification.id !== notificationId));

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
        {(showAllNotifications ? [notifications] : [notifications.filter((item) => item.isUnRead)]).map((notificationList, index) => (
            <List disablePadding key={index}>
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                {index === 0 ? 'New' : 'Read'}
              </ListSubheader>
              {notificationList.map((notification, index) => (
                <NotificationItem
                  key={`${notification.id}-${index}`}  // Using a combination of id and index
                  notification={notification}
                  markAsRead={handleMarkAsRead}
                />
              ))}
            </List>
          ))}
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
    markAsRead(notification.id);
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
