import Layout from "@/components/layout/Layout"
export default function NotFound() {

	return (
    <>
      <Layout classLisst="single page-404">
        <div className="container">
          <article className="entry-wraper mb-5">
            <h1 className="text-center mb-3 mt-5">404</h1>
            <form action="#" method="get" className="search-form d-lg-flex open-search mb-5">
              <i className="icon-search" />
              <input type="text" className="search_field" placeholder="Search..." defaultValue="" name="s" />
            </form>
            <p className="text-center">
              The link you clicked may be broken or the page may have been removed.
              <br />
              visit the <a href="index.html">Homepage</a> or <a href="contact.html">Contact us</a> about the problem
            </p>
          </article>
          {/*entry-content*/}
        </div>
        {/*container*/}
      </Layout>
    </>
  );
}