import styles from './CustomCheckbox.module.css';
const CustomCheckbox = (props) => {

  return (
    <div className={styles.custom_checkbox}>
      <input tabIndex="0" type="checkbox" checked={props.checked} id={props.id} className={styles.checkbox_input} 
        onChange={() => {}}/>
      {
         props && props.label ?
        <label htmlFor={props.id} className={`${styles.checkbox_label} ${props.type == 'payment' ? 'ps-5' : 'md:ps-11 ps-8'} text-nowrap text-left`}>{ props.label }</label>
        : ''
      }
    </div>
  )
}
export default CustomCheckbox;