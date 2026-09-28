function Toast({ message, type = "success" }) {
  if (!message) {
    return null;
  }

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-icon">
        {type === "success" ? "✓" : "!"}
      </span>

      <span>{message}</span>
    </div>
  );
}

export default Toast;