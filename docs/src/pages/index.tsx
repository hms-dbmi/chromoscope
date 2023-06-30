import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
// @ts-expect-error no type defined
import teaser from '@site/static/img/teaser.png';

import styles from './index.module.css';

function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <header className={clsx('hero hero--primary', styles.heroBanner)}>
            <div className="container">
                <h1 className="hero__title">{siteConfig.title}</h1>
                <p className="hero__subtitle">{siteConfig.tagline}</p>
                <div className={styles.indexCtas}>
                    <Link className="button button--secondary button--lg" to="/documentation/category/loading-data">
                        Get Started
                    </Link>
                    <Link className="button button--secondary button--lg" to="/documentation/category/use-cases">
                        Use Cases
                    </Link>
                    <Link className="button button--secondary button--lg" to="https://chromoscope.bio">
                        Try a Demo
                    </Link>
                </div>
                {/* <div className={styles.buttons}>
                    <Link className="button button--secondary button--lg" to="https://">
                        Try a Demo
                    </Link>
                </div> */}
            </div>
        </header>
    );
}

export default function Home(): JSX.Element {
    const { siteConfig } = useDocusaurusContext();
    return (
        <Layout title={siteConfig.title}>
            <HomepageHeader />
            <div className="text--center" style={{ paddingTop: 30 }}>
                <img src={teaser} width={1000} />
            </div>
            <main>
                <HomepageFeatures />
            </main>
            {/* Add Citations */}
        </Layout>
    );
}
