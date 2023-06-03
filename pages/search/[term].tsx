import { NextSeo } from 'next-seo'
import Card from '../../components/Card'
import { sanityClient } from '../../sanity'

function Search({ posts, term }: any) {
  return (
    <div>
      <NextSeo
        title="Searching through Dixcovery"
        canonical={`https://dixcovery.vercel.app/search/${term}`}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: `${term}, news, blog, post, dixcovery post, dixcovery news, dixcovery, strike, nigeria news, news website`,
          },
        ]}
      />
      <div className="p-5 md:px-10">
        <p className="text-xs font-medium">{posts.length} results in all</p>
        <div className="mt-5">
          {posts.length > 0 ? (
            <div className="mb-28 grid min-h-screen w-full grid-cols-1 place-items-start gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post: any) => {
                return <Card key={post._id} data={post} />
              })}
            </div>
          ) : (
            <p className="text-center text-sm">
              No post found from search term "{term}"
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Search

export const getServerSideProps = async (context: any) => {
  let term = context.params.term
  const postQuery = `*[_type == "post" && title match $term]{
      _id,
      title,
      categories[] -> {
        _id,
        title,
      },
      description,
      mainImage,
      slug,
      _createdAt,
      likes
    }`

  const posts = await sanityClient.fetch(postQuery, {
    term: term + '*',
  })

  return {
    props: {
      posts,
      term,
    },
  }
}
