import { useState } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head'

import Header from '../components/Header'
import { HeroPost } from '../components/HeroPost';

import { getPrismicClient } from '../services/prismic'
import Prismic from '@prismicio/client'

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
  preview: boolean;
}

export default function Home({postsPagination, preview}: HomeProps) {
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);
  const nextlink = postsPagination.next_page

  async function handleLoadMore() {
    const newPosts = await fetch(nextlink).then(response => response.json())

    const morePosts: Post[] = newPosts.results.map(post => {
      return {
        uid: post.uid,
        first_publication_date: post.first_publication_date,
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
      };
    });

    setPosts([...posts, ...morePosts])
    
  }

  return (
    <>
      <Head>
          <title>Home | spacetraveling</title>
      </Head> 
      <Header />

      <main className={commonStyles.container}>
        <div className={`${styles.posts} ${commonStyles.postsContainer}`}>
          {posts.map(post => (
            <HeroPost
              uid={post.uid}
              title={post.data.title}
              date={post.first_publication_date}
              subtitle={post.data.subtitle}
              author={post.data.author}
            />
          ))}
          {nextlink && 
          <button type="button" onClick={handleLoadMore}
          >Carregar mais posts</button>}
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ preview = false, previewData }) => {
  const prismic = getPrismicClient()
  const postsResponse = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 20,
    }
    )
  
  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    }
  })
  
  const nextPage = postsResponse.next_page

  return {
    props: {
      postsPagination: {
        results: posts,
        next_page: nextPage,
      },
      preview,
    },
    }
  }
