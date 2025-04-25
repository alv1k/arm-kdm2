import styles from './CustomCheckbox.module.css';
const CustomCheckbox = (props) => {
  return (
    <div class={styles.custom_checkbox}>
      <input type="checkbox" id="checkbox" class={styles.checkbox_input}/>
      {
        props.label ?
        <label for="checkbox" class={`${styles.checkbox_label} + md:ps-11 ps-8`}>{ props.label }</label>
        : ''
      }
    </div>
  )
}
export default CustomCheckbox;