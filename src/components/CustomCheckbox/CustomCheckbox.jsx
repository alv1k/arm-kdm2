import styles from './CustomCheckbox.module.css';
const CustomCheckbox = (props) => {

  return (
    <div className={styles.custom_checkbox}>
      <input type="checkbox" checked={props.checked} id={props.id} className={styles.checkbox_input} 
        onChange={() => {}}/>
      {
        props && props.label ?
        <label 
          tabIndex={0} 
          htmlFor={props.id} 
          className={`${styles.checkbox_label} ${props.type == 'payment' ? 'ps-5' : 'md:ps-11 ps-8'} text-nowrap text-left`}
          onKeyDown={(e) => {
            // Добавляем обработку нажатия пробела/Enter
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              document.getElementById(props.id)?.click();
            }
          }}
        >
          { props.label }
        </label>
        : ''
      }
    </div>
  )
}
export default CustomCheckbox;