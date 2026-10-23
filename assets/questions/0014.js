// Soal lesson 0014: Angular Service & DI hierarkis, routing + lazy loading, guard. Lihat assets/README.md.
QuestionBank.labelTopics({
  "ng-di": "Angular Service & DI hierarkis",
  "ng-routing": "Routing & lazy loading",
  "ng-guard": "Route guard",
});

// Urutan registrasi sengaja diselang-seling antar topik (interleaving) dan posisi jawaban bervariasi.
QuestionBank.register([
  {
    id: "0014-01", lesson: "0014", topic: "ng-di", type: "mc",
    prompt: "<code>ProductService</code> ditandai <code>@Injectable({ providedIn: 'root' })</code> dan di-inject di lima component. Berapa instance yang dibuat?",
    options: {
      a: "Satu instance baru untuk setiap component",
      b: "Satu instance bersama untuk seluruh aplikasi",
      c: "Satu instance baru untuk setiap request",
      d: "Satu instance baru untuk setiap NgModule",
    },
    answer: "b",
    explain: "<code>providedIn: 'root'</code> mendaftarkan service di root injector: \"Angular creates a single, shared instance\". Bonusnya tree-shakable. Padanan React: satu Context Provider di sekitar <code>&lt;App /&gt;</code>; padanan Node: modul yang di-<code>require</code> sekali lalu di-cache.",
  },
  {
    id: "0014-02", lesson: "0014", topic: "ng-routing", type: "mc",
    prompt: "Route mana yang harus diletakkan <strong>paling akhir</strong> di array <code>Routes</code>?",
    options: {
      a: "Route redirect untuk path kosong",
      b: "Route detail dengan parameter id",
      c: "Route lazy loading modul admin",
      d: "Route wildcard dengan path <code>**</code>",
    },
    answer: "d",
    explain: "Router memakai strategi <em>first-match wins</em>. Wildcard <code>**</code> cocok dengan URL apa pun, jadi kalau ditaruh di atas, route lain tidak akan pernah terpilih. Redirect <code>''</code> juga harus di atas wildcard.",
  },
  {
    id: "0014-03", lesson: "0014", topic: "ng-guard", type: "mc",
    prompt: "Guard <code>canActivate</code> mengembalikan <code>router.parseUrl('/login')</code> untuk user anonim. Apa yang terjadi?",
    options: {
      a: "Navigasi dibatalkan, lalu diarahkan ke <code>/login</code>",
      b: "Navigasi lanjut dan <code>/login</code> dibuka bersamaan",
      c: "Navigasi berhenti, user tetap di halaman",
      d: "Router melempar error karena tipe salah",
    },
    answer: "a",
    explain: "<code>parseUrl</code> menghasilkan <code>UrlTree</code>: navigasi saat ini dibatalkan dan navigasi baru ke <code>UrlTree</code> itu dimulai. <code>true</code> = lanjut, <code>false</code> = berhenti dan user tetap di tempat.",
  },
  {
    id: "0014-04", lesson: "0014", topic: "ng-di", type: "mc",
    prompt: "<code>ProductFormComponent</code> menulis <code>providers: [FormStateService]</code> di <code>@Component</code>. Apa akibatnya?",
    options: {
      a: "Satu instance dibagi ke seluruh aplikasi",
      b: "Service hanya bisa dipakai di <code>AppModule</code>",
      c: "Tiap component mendapat instance service sendiri",
      d: "Angular melempar error karena service duplikat",
    },
    answer: "c",
    explain: "Provider di level component masuk ke <code>ElementInjector</code>: setiap instance component mendapat instance service baru, terlihat oleh child-nya, dan ikut dihancurkan saat component dihancurkan. Padanan React: <code>&lt;FormContext.Provider&gt;</code> di dalam component itu.",
  },
  {
    id: "0014-05", lesson: "0014", topic: "ng-routing", type: "mc",
    prompt: "Bagaimana membuat <code>AdminModule</code> hanya diunduh saat user pertama kali membuka <code>/admin</code>?",
    options: {
      a: "Tambahkan modul itu ke array <code>imports</code> <code>AppModule</code>",
      b: "Pakai <code>loadChildren</code> dengan <code>import()</code> dinamis di route",
      c: "Pakai <code>component</code> dengan nama modul di route",
      d: "Daftarkan modul itu di <code>providers</code> milik <code>AppModule</code>",
    },
    answer: "b",
    explain: "<code>loadChildren: () =&gt; import('./admin/admin.module').then(m =&gt; m.AdminModule)</code>. Modul itu juga harus dihapus dari <code>imports</code> <code>AppModule</code>, kalau tidak ia tetap ikut bundle awal. Padanan React: <code>React.lazy(() =&gt; import(...))</code>.",
  },
  {
    id: "0014-06", lesson: "0014", topic: "ng-guard", type: "mc",
    prompt: "Di Angular <strong>16</strong>, bentuk guard yang direkomendasikan dokumentasi adalah…",
    options: {
      a: "Class dengan <code>implements</code> interface <code>CanActivate</code>",
      b: "Middleware yang dipasang di server",
      c: "Directive <code>*ngIf</code> di setiap template",
      d: "Function <code>CanActivateFn</code> yang memanggil <code>inject()</code>",
    },
    answer: "d",
    explain: "Sejak v15.2/v16, class guard (<code>implements CanActivate</code>) ditandai <em>deprecated</em> \"in favor of functional guards\". Dependensi diambil dengan <code>inject(AuthService)</code> di dalam function. <code>*ngIf</code> hanya menyembunyikan tampilan, bukan melindungi route.",
  },
  {
    id: "0014-07", lesson: "0014", topic: "ng-di", type: "mc",
    prompt: "Component meminta <code>LoggerService</code> di constructor. Ke mana Angular mencari provider-nya lebih dulu?",
    options: {
      a: "<code>ElementInjector</code> component itu, lalu naik ke parent",
      b: "Root injector dulu, lalu turun ke child",
      c: "<code>NullInjector</code> dulu, lalu turun ke root injector",
      d: "File <code>environment.ts</code> dulu, lalu ke root injector",
    },
    answer: "a",
    explain: "Resolusi dua fase: naik di pohon <code>ElementInjector</code> (component → parent → …), lalu ke hierarki <code>ModuleInjector</code> (root). Kalau tetap tidak ketemu, <code>NullInjector</code> melempar error. Provider pertama yang ditemukan yang dipakai, mirip <code>useContext</code> membaca Provider terdekat di atasnya.",
  },
  {
    id: "0014-08", lesson: "0014", topic: "ng-routing", type: "mc",
    prompt: "<code>ProductDetailComponent</code> perlu membaca <code>id</code> dari URL <code>/products/42</code>. Apa yang di-inject?",
    options: {
      a: "<code>HttpClient</code>, lalu parse <code>window.location</code> manual",
      b: "<code>ElementRef</code>, lalu baca atribut <code>href</code>",
      c: "<code>ActivatedRoute</code>, lalu baca hasil <code>paramMap.get('id')</code>",
      d: "<code>FormsModule</code>, lalu baca nilai <code>ngModel</code>",
    },
    answer: "c",
    explain: "<code>this.route.snapshot.paramMap.get('id')</code> (sekali baca) atau <code>this.route.paramMap.pipe(...)</code> kalau component dipakai ulang untuk id lain. Padanan React Router: <code>useParams()</code>.",
  },
  {
    id: "0014-09", lesson: "0014", topic: "ng-guard", type: "mc",
    prompt: "<code>AdminModule</code> yang lazy sudah dilindungi <code>canActivate</code>, tapi bundle-nya tetap terunduh untuk user anonim. Guard apa yang mencegah modul itu dimuat?",
    options: {
      a: "<code>canDeactivate</code>",
      b: "<code>canMatch</code>",
      c: "<code>resolve</code>",
      d: "<code>canActivateChild</code>",
    },
    answer: "b",
    explain: "<code>canMatch</code> menentukan apakah route dipakai sama sekali, dan dicek <em>sebelum</em> modul lazy dimuat. Kalau <code>false</code>, router lanjut mencocokkan route lain (mis. wildcard). <code>canLoad</code> versi lama sudah deprecated.",
  },
  {
    id: "0014-10", lesson: "0014", topic: "ng-di", type: "mc",
    prompt: "Apa padanan React yang paling dekat untuk <strong>DI hierarkis</strong> Angular?",
    options: {
      a: "Prop drilling dari root ke leaf",
      b: "State lokal <code>useState</code> di tiap component",
      c: "Memoization nilai turunan dengan hook <code>useMemo</code>",
      d: "Context Provider bertingkat, dibaca lewat <code>useContext</code>",
    },
    answer: "d",
    explain: "Keduanya mencari nilai dari pemberi terdekat di atas pohon component, dan Provider yang lebih dalam meng-override yang di atas. Bedanya: Angular menyuntikkan berdasarkan tipe/token lewat constructor atau <code>inject()</code>, dan yang dibagi adalah instance class Service, bukan sekadar value.",
  },
  {
    id: "0014-oral-1", lesson: "0014", topic: "ng-di", type: "oral",
    prompt: "\"Anda dari React. Bagaimana Angular 16 berbagi logika antar component lewat Service dan DI, dan bagaimana Anda melindungi halaman admin dengan routing dan guard?\" (60 detik)",
    sample: "Di Angular, logika dan state yang dibagi ditaruh di <strong>Angular Service</strong>, class <code>@Injectable</code> yang disuntikkan lewat constructor atau <code>inject()</code>. Kalau <code>providedIn: 'root'</code>, Angular membuat satu instance bersama untuk seluruh aplikasi, dan service-nya tree-shakable. Kalau saya taruh di <code>providers</code> sebuah component, setiap instance component itu dapat instance sendiri yang ikut hancur bersama component. Injector-nya hierarkis: Angular mencari dari <code>ElementInjector</code> component ke parent, lalu ke root, mirip <code>useContext</code> yang membaca Provider terdekat, bedanya yang dibagi instance class dan dipilih berdasarkan tipe. Untuk halaman, saya definisikan <code>Routes</code> di <code>AppRoutingModule</code> dengan <code>RouterModule.forRoot</code>, pakai <code>routerLink</code> dan <code>&lt;router-outlet&gt;</code>, dan wildcard <code>**</code> di paling akhir karena first-match wins. Fitur admin saya lazy load dengan <code>loadChildren</code> dan <code>import()</code>, seperti <code>React.lazy</code>. Lalu saya pasang functional guard <code>CanActivateFn</code> yang meng-inject <code>AuthService</code>: kalau login kembalikan <code>true</code>, kalau tidak kembalikan <code>UrlTree</code> ke <code>/login</code>. Supaya bundle admin tidak terunduh untuk user anonim, guard yang sama saya pasang di <code>canMatch</code>. Guard hanya UX; otorisasi sebenarnya tetap di API.",
    checklist: [
      "Angular Service = class @Injectable yang disuntikkan lewat constructor atau inject()",
      "providedIn: 'root' = satu instance bersama (dan tree-shakable)",
      "providers di component = instance per component (ElementInjector), resolusi naik ke parent lalu root, dibandingkan dengan React Context",
      "Routes + routerLink + router-outlet, dan wildcard ** paling akhir (first-match wins)",
      "lazy loading dengan loadChildren + import() (padanan React.lazy)",
      "functional guard CanActivateFn dengan inject(), return true atau UrlTree, plus canMatch / guard bukan pengganti otorisasi API",
    ],
  },
]);
