import styles from './LoginPage.module.css';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate('/settings')
  }

  return (
    <div className={styles.mainLogin}>
      <div className="md:text-3xl md:bg-green-900 text-sm bg-blue-900">loginPage</div>
      <button className="border-2 rounded-3xl" style={{fontSize: 56}} onClick={handleButtonClick}>
        testButton1
      </button>
    </div>
  )
}
export default LoginPage;