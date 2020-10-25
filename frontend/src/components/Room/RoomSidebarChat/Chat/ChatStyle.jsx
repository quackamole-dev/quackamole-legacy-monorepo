export default ({ palette, spacing }) => {
  const radius = spacing(2.5);
  const size = spacing(4);
  const rightBgColor = palette.primary.main;
  return {
    wrapper: {
      '&:nth-child(1)': {
        marginTop: 'auto' // https://bugs.chromium.org/p/chromium/issues/detail?id=411624
      }
    },
    avatar: {
      width: size,
      height: size
    },
    leftRow: {
      textAlign: 'left'
    },
    rightRow: {
      textAlign: 'right'
    },
    msg: {
      padding: spacing(1, 2),
      borderRadius: 4,
      marginBottom: 4,
      display: 'inline-block',
      wordBreak: 'break-word',
      fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
      fontSize: '14px'
    },
    left: {
      borderTopRightRadius: radius,
      borderBottomRightRadius: radius,
      backgroundColor: palette.grey[100]
    },
    right: {
      borderTopLeftRadius: radius,
      borderBottomLeftRadius: radius,
      backgroundColor: rightBgColor,
      color: palette.common.white
    },
    leftFirst: {
      borderTopLeftRadius: radius
    },
    leftLast: {
      borderBottomLeftRadius: radius
    },
    rightFirst: {
      borderTopRightRadius: radius
    },
    rightLast: {
      borderBottomRightRadius: radius
    }
  };
};
