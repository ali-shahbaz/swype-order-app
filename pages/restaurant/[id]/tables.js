import useSessionStorage from '../../../hooks/useSessionStorage';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../../../components/head';

const Tables = () => {
    let state = useSessionStorage('init_data');
    const router = useRouter();
    const { id } = router.query;

    if (!state) return <div id="loader">
        <Image src="/images/favicon.png" width={32} height={32} layout="fixed" alt="icon" className="loading-icon" />
    </div>
    state = state.payload.data;
    return <>
        <Header title="Select Your Section"></Header>
        <ul className="listview separate-list image-listview no-line no-arrow inset">
            {state.quickTables.map((item, index) => {
                return <li key={item.tableId} className="items-card card card-border">
                    <Link href="/restaurant/1/menu">
                        <a className="item">
                            <div className="in">
                                <h4 className="m-0">{item.name}</h4>
                            </div>
                        </a>
                    </Link>
                </li>
            })}
        </ul>
        <div className="section">
            <div className="mt-4">
                <Link href={`/restaurant/${id}/menu`}>
                    <a className="btn btn-primary btn-shadow btn-lg btn-block mt-2">{"I don't know my section"}</a>
                </Link>
            </div>
        </div>
    </>
}
export default Tables;