import styles from './CustomCheckbox.module.css';
const CustomCheckbox = (props) => {
  return (
    <div className={styles.custom_checkbox}>
      <input type="checkbox" id="checkbox" className={styles.checkbox_input}/>
      {
        props.label ?
        <label htmlFor="checkbox" className={`${styles.checkbox_label} + md:ps-11 ps-8`}>{ props.label }</label>
        : ''
      }
    </div>
  )
}
export default CustomCheckbox;