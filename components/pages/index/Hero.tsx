import Image from 'next/image';
import classes from './Hero.module.scss';

import HeroImg from '../../../public/img/aquila-hero.png';

const Hero = () => {
    return (
        <div className={classes.hero}>
            <div className={classes["hero__text-area"]}>
                <h2 className={classes["hero__text-main-title"]}>Human curated search engine</h2>
                <p className={classes["hero__text-main-desc"]}>Build a curated list of websites, aggregate into searchable pool of ideas.
Works with paywall-protected websites.</p>
            </div>
            <div className={classes["hero__btn-area"]}>
                    <button className={`${classes["hero__btn"]} ${classes["hero__btn--blue"]}`}>Sign up with Telegram</button>
                    <button className={`${classes["hero__btn"]} ${classes["hero__btn--red"]}`}>Sign up with Email</button>
            </div>
            <div className={classes["hero__img-area"]}>
                <Image src={HeroImg} alt="Hero Image" objectFit="fill"  />
            </div>
            <div className={classes["hero__footer-text"]}>
                <p>Aquila offers you a familiar search experience.
Easily organize and share your curated list with anybody.</p>
            </div>
        </div>
    )
}

export default Hero;