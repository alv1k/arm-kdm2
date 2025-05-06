const DateFormatter = ({ dateString }) => {
  const formatDate = (date) => {
    const [y, m, d] = date.split('-');
    return `${d}.${m}.${y}`;
  };

  return <span>{formatDate(dateString)}</span>;
}

export default DateFormatter;