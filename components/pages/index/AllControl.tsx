import Image from "next/image";

import classes from "./AllControl.module.scss";
import AllControlImg from "../../../public/img/aquila-control.png";

const AllControl = () => {
    return (
        <div className={classes["all-control"]}>
            <div className={classes["all-control__img-area"]}>
                <Image alt="All Control" src={AllControlImg}/>
            </div>
            <div className={classes["all-control__text-area"]}>
                <h3 className={classes["all-control__title"]}>You’ve got all the control</h3>
                <p className={classes["all-control__desc"]}>nstall a browser extension and you&apos;re ready to go.
We&apos;ve made our software <a className={classes["all-control__desc-link"]} href="" target="__blank">Open Source</a> for public scrutiny &amp; trust</p>
            </div>
        </div>
    )
}

export default AllControl;