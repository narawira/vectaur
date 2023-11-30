import { Button } from "@/components/ui/button";

export default function WorkingTask() {
	return (
		<div className="prose mx-auto py-10 px-4 sm:px-0 text-justify">
			<h1 className="text-center">Support Vectaur</h1>
			<p className="text-center">
				<a href="https://github.com/sponsors/narawira" target="_blank">
					<Button variant="destructive">
						Become a Sponsor
					</Button>
				</a>
			</p>
			<h2>A Space Reserved for Visionaries</h2>
			<p>While Vectaur is currently seeking its first group of sponsors, this space is dedicated to recognizing and celebrating those who will soon join us in driving innovation in design.</p>
			<h3>Anticipating Our First Sponsors</h3>
			<h4>🌱 Seedling ($2 a month)</h4>
			<p><em>A stepping stone for supporters who wish to help Vectaur flourish.</em></p>
			<ol>
				<li><p><strong>Your name is in our README on GitHub.</strong></p></li>
				<li><p><strong>Exclusive reminder of new features and updates.</strong></p></li>
			</ol>
			<h4>🌳 Sapling ($8 a month)</h4>
			<p><em>Perfect for individuals utilizing Vectaur in their creative endeavors.</em></p>
			<ol>
				<li><p><strong>All Seedling benefits.</strong></p></li>
				<li><p><strong>Your name are featured on Vectaur&apos;s GitHub and this page.</strong></p></li>
				<li><p><strong>Priority in feature request considerations.</strong></p></li>
			</ol>
			<h4>🌲 Forest ($16 a month)</h4>
			<p><em>Geared towards professionals and enterprises leveraging Vectaur&apos;s full potential.</em></p>
			<ol>
				<li><p><strong>All Sapling benefits.</strong></p></li>
				<li><p><strong>Your name and company logo are featured on Vectaur&apos;s GitHub and this page.</strong></p></li>
			</ol>
			<h3>The Role of Our Sponsors</h3>
			<p>Your sponsorship will be instrumental in shaping the future of Vectaur. As a sponsor, you will:</p>
			<ol>
				<li>Support the ongoing development and maintenance of Vectaur.</li>
				<li>Help keep Vectaur free and accessible to the design community.</li>
				<li>Contribute to a project that values innovation and collaboration.</li>
			</ol>
			<h3>Become a Sponsor</h3>
			<p>Are you interested in becoming a sponsor? Visit our <a href="https://github.com/sponsors/narawira" target="_blank">GitHub Sponsors page</a> to start making a difference. Every contribution, no matter the size, is valued and important.</p>
			<h3>Contact Us</h3>
			<p>For any inquiries about sponsorship or collaboration, please <a href="mailto:dev@narawira.com" target="_blank">contact us</a>. We are excited to discuss how we can work together.</p>
		</div>
	)
}
