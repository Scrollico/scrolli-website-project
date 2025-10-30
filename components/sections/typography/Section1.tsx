import Link from 'next/link'
import Image from 'next/image'

export default function Section1() {
  return (
    <>
      <div className="container">
        <div className="entry-header">
          <div className="mb-5">
            <h1 className="entry-title m_b_2rem">In 21st-century Korea, shamanism is not only thriving — but evolving</h1>
            <div className="entry-meta align-items-center">
              <Link className="author-avatar" href="#">
                <Image
                  alt="author avatar"
                  src="/assets/images/author-avata-2.jpg"
                  className="avatar"
                  width={120}
                  height={120}
                />
              </Link>
              <Link href="/author">Darcy Reeder</Link> in <Link href="/archive">OneZero</Link>
              <br />
              <span>Jun 17</span>
              <span className="middotDivider" />
              <span className="readingTime" title="3 min read">
                3 min read
              </span>
              <span className="svgIcon svgIcon--star">
                <svg className="svgIcon-use" width={15} height={15}>
                  <path d="M7.438 2.324c.034-.099.09-.099.123 0l1.2 3.53a.29.29 0 0 0 .26.19h3.884c.11 0 .127.049.038.111L9.8 8.327a.271.271 0 0 0-.099.291l1.2 3.53c.034.1-.011.131-.098.069l-3.142-2.18a.303.303 0 0 0-.32 0l-3.145 2.182c-.087.06-.132.03-.099-.068l1.2-3.53a.271.271 0 0 0-.098-.292L2.056 6.146c-.087-.06-.071-.112.038-.112h3.884a.29.29 0 0 0 .26-.19l1.2-3.52z" />
                </svg>
              </span>
            </div>
          </div>
        </div>
        {/*end single header*/}
        <article className="entry-wraper mb-5">
          <div className="entry-left-col">
            <div className="social-sticky">
              <Link href="#">
                <i className="icon-facebook" />
              </Link>
              <Link href="#">
                <svg
                  style={{
                    width: 10,
                    height: 10,
                    marginTop: "-3px",
                  }}
                  id="fi_5968958"
                  enableBackground="new 0 0 1226.37 1226.37"
                  viewBox="0 0 1226.37 1226.37"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m727.348 519.284 446.727-519.284h-105.86l-387.893 450.887-309.809-450.887h-357.328l468.492 681.821-468.492 544.549h105.866l409.625-476.152 327.181 476.152h357.328l-485.863-707.086zm-144.998 168.544-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721h-162.604l-323.311-462.446z" />
                </svg>
              </Link>
              <Link href="#">
                <i className="icon-heart" />
              </Link>
              <Link href="#">
                <i className="icon-paper-plane" />
              </Link>
            </div>
          </div>
          <p>The excerpt</p>
          <div className="excerpt m_b_2rem">Gosh jaguar ostrich quail one excited dear hello and bound and the and bland moral misheard roadrunner flapped lynx far that and jeepers giggled far and far bald that roadrunner python inside held shrewdly the manatee.</div>
          <div className="entry-main-content">
            <p>
              <strong>Headings</strong>
            </p>
            <h1>Header one</h1>
            <h2>Header two</h2>
            <h3>Header three</h3>
            <h4>Header four</h4>
            <h5>Header five</h5>
            <h6>Header six</h6>
            <h2>Blockquotes</h2>
            <p>Single line blockquote:</p>
            <blockquote>
              <p>Stay hungry. Stay foolish.</p>
            </blockquote>
            <p>Multi line blockquote with a cite reference:</p>
            <blockquote cite="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/blockquote">
              <p>
                The
                <strong>
                  HTML <code>&lt;blockquote&gt;</code> Element
                </strong>
                (or <em>HTML Block Quotation Element</em>) indicates that the enclosed text is an extended quotation. Usually, this is rendered visually by indentation (see <Link href="https://developer.mozilla.org/en-US/docs/HTML/Element/blockquote#Notes">Notes</Link> for how to change it). A URL for the source of the quotation may be given using the <strong>cite</strong> attribute, while a text representation of the source can be given using the
                <Link href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/cite" title="The HTML Citation Element <cite> represents a reference to a creative work. It must include the title of a work or a URL reference, which may be in an abbreviated form according to the conventions used for the addition of citation metadata.">
                  <code>&lt;cite&gt;</code>
                </Link>
                element.
              </p>
            </blockquote>
            <p>
              <cite>multiple contributors</cite> – MDN HTML element reference – blockquote
            </p>
            <h2>Tables</h2>
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Salary</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>
                    <a href="http://example.org/">John Doe</a>
                  </th>
                  <td>$1</td>
                  <td>Because that's all Steve Jobs needed for a salary.</td>
                </tr>
                <tr>
                  <th>
                    <a href="http://example.org/">Jane Doe</a>
                  </th>
                  <td>$100K</td>
                  <td>For all the blogging she does.</td>
                </tr>
                <tr>
                  <th>
                    <a href="http://example.org/">Fred Bloggs</a>
                  </th>
                  <td>$100M</td>
                  <td>Pictures are worth a thousand words, right? So Jane x 1,000.</td>
                </tr>
                <tr>
                  <th>
                    <a href="http://example.org/">Jane Bloggs</a>
                  </th>
                  <td>$100B</td>
                  <td>With hair like that?! Enough said…</td>
                </tr>
              </tbody>
            </table>
            <h2>Definition Lists</h2>
            <dl>
              <dt>Definition List Title</dt>
              <dd>Definition list division.</dd>
              <dt>Startup</dt>
              <dd>A startup company or startup is a company or temporary organization designed to search for a repeatable and scalable business model.</dd>
              <dt>#dowork</dt>
              <dd>Coined by Rob Dyrdek and his personal body guard Christopher "Big Black" Boykins, "Do Work" works as a self motivator, to motivating your friends.</dd>
              <dt>Do It Live</dt>
              <dd>
                I'll let Bill O'Reilly will
                <Link title="We'll Do It Live" href="https://www.youtube.com/watch?v=O_HyZ5aW76c">
                  explain
                </Link>
                this one.
              </dd>
            </dl>
            <h2>Unordered Lists (Nested)</h2>
            <ul>
              <li>
                List item one
                <ul>
                  <li>
                    List item one
                    <ul>
                      <li>List item one</li>
                      <li>List item two</li>
                      <li>List item three</li>
                      <li>List item four</li>
                    </ul>
                  </li>
                  <li>List item two</li>
                  <li>List item three</li>
                  <li>List item four</li>
                </ul>
              </li>
              <li>List item two</li>
              <li>List item three</li>
              <li>List item four</li>
            </ul>
            <h2>Ordered List (Nested)</h2>
            <ol start={8}>
              <li>
                List item one -start at 8
                <ol>
                  <li>
                    List item one
                    <ol reversed={true}>
                      <li>List item one -reversed attribute</li>
                      <li>List item two</li>
                      <li>List item three</li>
                      <li>List item four</li>
                    </ol>
                  </li>
                  <li>List item two</li>
                  <li>List item three</li>
                  <li>List item four</li>
                </ol>
              </li>
              <li>List item two</li>
              <li>List item three</li>
              <li>List item four</li>
            </ol>
            <h2>HTML Tags</h2>
            <p>
              These supported tags come from the WordPress.com code
              <Link title="Code" href="https://en.support.wordpress.com/code/">
                FAQ
              </Link>
              .
            </p>
            <p>
              <strong>Address Tag</strong>
            </p>
            <address>
              1 Infinite Loop
              <br />
              Cupertino, CA 95014
              <br />
              United States
            </address>
            <p>
              <strong>Anchor Tag (aka. Link)</strong>
            </p>
            <p>
              This is an example of a
              <Link title="WordPress Foundation" href="https://wordpressfoundation.org/">
                link
              </Link>
              .
            </p>
            <p>
              <strong>Abbreviation Tag</strong>
            </p>
            <p>
              The abbreviation <abbr title="Seriously">srsly</abbr> stands for "seriously".
            </p>
            <p>
              <strong>
                Acronym Tag (<em>deprecated in HTML5</em>)
              </strong>
            </p>
            <p>
              The acronym <abbr title="For The Win">ftw</abbr> stands for "for the win".
            </p>
            <p>
              <strong>Big Tag</strong> (<em>deprecated in HTML5</em>)
            </p>
            <p>
              These tests are a <big>big</big> deal, but this tag is no longer supported in HTML5.
            </p>
            <p>
              <strong>Cite Tag</strong>
            </p>
            <p>
              "Code is poetry." —<cite>Automattic</cite>
            </p>
            <p>
              <strong>Code Tag</strong>
            </p>
            <p>
              This tag styles blocks of code.
              <br />
              <code>
                .post-title {"{"}
                <br />
                margin: 0 0 5px;
                <br />
                font-weight: bold;
                <br />
                font-size: 38px;
                <br />
                line-height: 1.2;
                <br />
                and here's a line of some really, really, really, really long text, just to see how it is handled and to find out how it overflows;
                <br />
                {"}"}
              </code>
              <br />
              You will learn later on in these tests that word-wrap: break-word;will be your best friend.
            </p>
            <p>
              <strong>Delete Tag</strong>
            </p>
            <p>
              This tag will let you <del cite="deleted it">strike out text</del>, but this tag is <em>recommended</em> supported in HTML5 (use the <code>&lt;s&gt;</code> instead).
            </p>
            <p>
              <strong>Emphasize Tag</strong>
            </p>
            <p>
              The emphasize tag should <em>italicize</em> <i>text</i>.
            </p>
            <p>
              <strong>Horizontal Rule Tag</strong>
            </p>
            <hr />
            <p>
              This sentence is following a <code>&lt;hr /&gt;</code> tag.
            </p>
            <p>
              <strong>Insert Tag</strong>
            </p>
            <p>
              This tag should denote <ins cite="inserted it">inserted</ins> text.
            </p>
            <p>
              <strong>Keyboard Tag</strong>
            </p>
            <p>
              This scarcely known tag emulates <kbd>keyboard text</kbd>, which is usually styled like the <code>&lt;code&gt;</code> tag.
            </p>
            <p>
              <strong>Preformatted Tag</strong>
            </p>
            <p>This tag is for preserving whitespace as typed, such as in poetry or ASCII art.</p>
            <p>
              <strong>Quote Tag</strong> for short, inline quotes
            </p>
            <p>
              <q>Developers, developers, developers...</q> --Steve Ballmer
            </p>
            <p>
              <strong>Strike Tag</strong> (<em>deprecated in HTML5</em>) and <strong>S Tag</strong>
            </p>
            <p>
              This tag shows <s>strike-through</s> <s>text</s>.
            </p>
            <p>
              <strong>Small Tag</strong>
            </p>
            <p>
              This tag shows
              <small>
                smaller<small> text.</small>
              </small>
            </p>
            <p>
              <strong>Strong Tag</strong>
            </p>
            <p>
              This tag shows
              <strong>
                bold<strong> text.</strong>
              </strong>
            </p>
            <p>
              <strong>Subscript Tag</strong>
            </p>
            <p>
              Getting our science styling on with H<sub>2</sub>O, which should push the "2" down.
            </p>
            <p>
              <strong>Superscript Tag</strong>
            </p>
            <p>
              Still sticking with science and Albert Einstein's E = MC<sup>2</sup>, which should lift the 2 up.
            </p>
            <p>
              <strong>Teletype Tag </strong>(<em>obsolete in HTML5</em>)
            </p>
            <p>
              This rarely used tag emulates <code>teletype text</code>, which is usually styled like the <code>&lt;code&gt;</code> tag.
            </p>
            <p>
              <strong>Underline Tag</strong> <em>deprecated in HTML 4, re-introduced in HTML5 with other semantics</em>
            </p>
            <p>
              This tag shows <u>underlined text</u>.
            </p>
            <p>
              <strong>Variable Tag</strong>
            </p>
            <p>
              This allows you to denote <var>variables</var>.
            </p>
            <div className="entry-bottom">
              <div className="tags-wrap heading">
                <span className="tags">
                  <Link href="#" rel="tag">
                    fashion
                  </Link>
                  <Link href="#" rel="tag">
                    lifestyle
                  </Link>
                  <Link href="#" rel="tag">
                    news
                  </Link>
                  <Link href="#" rel="tag">
                    style
                  </Link>
                </span>
              </div>
            </div>
            <div className="box box-author m_b_2rem">
              <div className="post-author row-flex">
                <div className="author-img">
                  <Image
                    alt="author avatar"
                    src="/assets/images/author-avata-1.jpg"
                    className="avatar"
                    width={120}
                    height={120}
                  />
                </div>
                <div className="author-content">
                  <div className="top-author">
                    <h5 className="heading-font">
                      <Link href="/author" title="Ryan" rel="author">
                        Ryan Mark
                      </Link>
                    </h5>
                  </div>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse laoreet ut ligula et semper. Aenean consectetur, est id gravida venenatis.</p>
                  <div className="content-social-author">
                    <Link target="_blank" className="author-social" href="#">
                      Facebook
                    </Link>
                    <Link target="_blank" className="author-social" href="#">
                      Twitter
                    </Link>
                    <Link target="_blank" className="author-social" href="#">
                      Instagram
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
        {/*entry-content*/}

        {/*Begin Comment*/}
        <div className="single-comment comments_wrap">
          <section id="comments">
            <div className="comments-inner clr">
              <div id="respond" className="comment-respond">
                <h3 id="reply-title" className="comment-reply-title">
                  Leave a Reply
                </h3>
                <form action="#" method="post" id="commentform" className="comment-form" noValidate>
                  <p className="comment-notes">
                    <span id="email-notes">Your email address will not be published.</span> Required fields are marked <span className="required">*</span>
                  </p>
                  <p className="comment-form-comment">
                    <label htmlFor="comment">Comment</label>
                    <textarea id="comment" name="comment" cols={45} rows={8} maxLength={65525} required defaultValue={""} />
                  </p>
                  <div className="row">
                    <div className="comment-form-author col-sm-12 col-md-6">
                      <p>
                        <label htmlFor="author">Name*</label>
                        <input id="author" name="author" type="text" defaultValue="" size={30} aria-required="true" />
                      </p>
                    </div>
                    <div className="comment-form-email col-sm-12 col-md-6">
                      <p>
                        <label htmlFor="email">Email*</label>
                        <input id="email" name="email" type="email" defaultValue="" size={30} aria-required="true" />
                      </p>
                    </div>
                  </div>
                  <p className="form-submit">
                    <input name="submit" type="submit" id="submit" className="submit btn btn-success btn-block" defaultValue="Post Comment" />
                  </p>
                </form>
              </div>
              {/* #respond */}
            </div>
          </section>
        </div>
        {/*End Comment*/}
      </div>
      {/*container*/}
    </>
  );
}
