import styles from './UserAgreementPage.module.css'
import { hideNavbar } from '@/store/slices/navbarSlice';
import { useDispatch, useSelector } from 'react-redux';
import useMediaQueries from '@/hooks/useMediaQueries'; 


const UserAgreementPage = () => {

  const showNavbar = useSelector((state) => state.navbar.showNavbar);
  const { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint } = useMediaQueries();

  const sideClick = (event) => {
    event.stopPropagation();
    if (showNavbar) {
      dispatch(hideNavbar());
    }
  };


    return (
        <div
            className={`
            xl:ml-10 xl:px-10 xl:py-10 xl:rounded-x
            lg:ml-8 lg:px-4 lg:py-5 lg:shadow-none
            md:px-6 md:ms-5 md:rounded-xl md:shadow-sm
            w-full px-5 ms-0 bg-white shadow-none
            ${md_breakpoint ? 'md:ms-30 md:me-4' : ''}
            `}
            onClick={sideClick}
        >
            <div className={styles.header}>
                <div className={styles.title}>Соглашение</div>
                <div className={styles.subtitle}>об использовании материалов и сервисов интернет-сайта<br/>(пользовательское соглашение)</div>
                <div className={styles.signature}>
                    <div>г. Якутск</div>
                    <div>"___"________ ___ г.</div>
                </div>
            </div>

            <div className={styles.section}>
                Настоящее Соглашение является публичной офертой и определяет условия использования материалов и сервисов, размещенных на сайте в сети Интернет по адресу: <a className="text-blue-800" href="https://arenda.aokdm.ru">https://arenda.aokdm.ru</a>, посетителями и пользователями данного интернет-сайта (далее - Сайт).
            </div>

            <div className={styles.section}>
                <div className={styles.section_title}>1. Общие условия</div>
                
                <div className={styles.clause}>
                    <span className={styles.clause_title}>1.1.</span>
                    <span>&nbsp;Сайт создан для физических и юридических лиц, арендующих помещения и предназначен для автоматизации процессов управления арендой, оплаты, учета и взаимодействия между арендатором и арендодателем.</span>
                </div>
                
                <div className={styles.clause}>
                    <span className={styles.clause_title}>1.2.</span>
                    <span>&nbsp;Сайт содержит материалы и сервисы:</span>
                    <ul>
                        <li>доступ к Справочнику объектов недвижимости. Основные характеристики арендуемого помещения (Наименование, площадь, адрес);</li>
                        <li>доступ к Справочнику договоров и дополнительных соглашений к договорам, в котором указаны объект аренды, площадь, ставка, сумма НДС, переменная часть (счетчик, услуга, сумма НДС);</li>
                        <li>Список выставленных счетов (Номер, дата, сумма, договор, реквизиты оплаты, QR-код);</li>
                        <li>Акты сверок;</li>
                        <li>Возможность оплаты арендных платежей</li>
                        <li>Справочник счетчиков, а также вводить показания счетчиков;</li>
                        <li>Возможность оставлять заявки на обслуживание.</li>
                    </ul>
                </div>
                
                <div className={styles.clause}>
                    <span className={styles.clause_title}>1.3.</span>
                    <span>&nbsp;Использование материалов и сервисов Сайта регулируется нормами действующего законодательства Российской Федерации.</span>
                </div>
                
                <div className={styles.clause}>
                    <span className={styles.clause_title}>1.4.</span>
                    <span>&nbsp;Для получения доступа к материалам Сайта Пользователю необходимо выполнить следующие действия:</span>
                    <ul>
                        <li>заполнить регистрационную форму;</li>
                        <li>зарегистрироваться и авторизоваться через логин и пароль.</li>
                    </ul>
                </div>
                
                <div className={styles.clause}>
                    <span className={styles.clause_title}>1.5.</span>
                    <span>&nbsp;Получая доступ к материалам Сайта, Пользователь считается присоединившимся к настоящему Соглашению.</span>
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.section_title}>2. Обязательства Пользователя</div>
                
                <div className={styles.clause}>
                    <span className={styles.clause_title}>2.1.</span>
                    <span>&nbsp;Пользователь соглашается не предпринимать действий и не оставлять комментарии и записи, которые могут рассматриваться как нарушающие российское законодательство или нормы международного права, в том числе в сфере интеллектуальной собственности, авторских и/или смежных прав, общепринятые нормы морали и нравственности, а также любых действий, которые приводят или могут привести к нарушению нормальной работы Сайта и сервисов Сайта.</span>
                </div>
                
                <div className={styles.clause}>
                    <span className={styles.clause_title}>2.2.</span>
                    <span>&nbsp;Использование материалов Сайта без согласия правообладателей не допускается.</span>
                </div>
                
                <div className={styles.clause}>
                    <span className={styles.clause_title}>2.3.</span>
                    <span>&nbsp;При цитировании материалов Сайта, включая охраняемые авторские произведения, ссылка на Сайт обязательна.</span>
                </div>
                
                <div className={styles.clause}>
                    <span className={styles.clause_title}>2.4.</span>
                    <span>&nbsp;Администрация Сайта не несет ответственности за посещение и использование им внешних ресурсов, ссылки на которые могут содержаться на Сайте.</span>
                </div>
                
                <div className={styles.clause}>
                    <span className={styles.clause_title}>2.5.</span>
                    <span>&nbsp;Администрация Сайта не несет ответственности и не имеет прямых или косвенных обязательств перед Пользователем в связи с любыми возможными или возникшими потерями или убытками, связанными с любым содержанием Сайта, регистрацией авторских прав и сведениями о такой регистрации, товарами или услугами, доступными на или полученными через внешние сайты или ресурсы либо иные контакты Пользователя, в которые он вступил, используя размещенную на Сайте информацию или ссылки на внешние ресурсы.</span>
                </div>
                
                <div className={styles.clause}>
                    <span className={styles.clause_title}>2.6.</span>
                    <span>&nbsp;Пользователь согласен с тем, что Администрация Сайта не несет какой-либо ответственности и не имеет каких-либо обязательств в связи с рекламой, которая может быть размещена на Сайте.</span>
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.section_title}>3. Прочие условия</div>
                
                <div className={styles.clause}>
                    <span className={styles.clause_title}>3.1.</span>
                    <span>&nbsp;Все возможные споры, вытекающие из настоящего Соглашения или связанные с ним, подлежат разрешению в соответствии с действующим законодательством Российской Федерации.</span>
                </div>
                
                <div className={styles.clause}>
                    <span className={styles.clause_title}>3.2.</span>
                    <span>&nbsp;Признание судом какого-либо положения Соглашения недействительным или не подлежащим принудительному исполнению не влечет недействительности иных положений Соглашения.</span>
                </div>
                
                <div className={styles.clause}>
                    <span className={styles.clause_title}>3.3.</span>
                    <span>&nbsp;Бездействие со стороны Администрации Сайта в случае нарушения кем-либо из Пользователей положений Соглашения не лишает Администрацию Сайта права предпринять позднее соответствующие действия в защиту своих интересов и защиту авторских прав на охраняемые в соответствии с законодательством материалы Сайта.</span>
                </div>
                
                <div className={styles.clause}>
                    <span className={styles.clause_title}>3.4.</span>
                    <span>&nbsp;Администрация Сайта вправе в любое время в одностороннем порядке изменять условия настоящего Соглашения. Такие изменения вступают в силу по истечении 3 (трех) дней с момента размещения новой версии Соглашения на сайте. При несогласии Пользователя с внесенными изменениями он обязан отказаться от доступа к Сайту, прекратить использование материалов и сервисов Сайта.</span>
                </div>
                
                <div className={styles.clause}>
                    <span className={styles.clause_title}>3.5.</span>
                    <span>&nbsp;Переходя по ссылке <a className="text-blue-800" href="https://arenda.aokdm.ru">https://arenda.aokdm.ru</a>, Пользователь подтверждает, что принимает условия настоящего Соглашения, а также Политики конфиденциальности Сайта, являющейся неотъемлемой частью настоящего Соглашения.</span>
                </div>
            </div>
        </div>
       
    )
}
export default UserAgreementPage;
