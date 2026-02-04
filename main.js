// 1. GLOBAL TRACKER & SETTINGS
const pageTracker = { stylish: 0, bio: 0, symbol: 0, color: 0 };
const PAGE_SIZE = 50;

// Automatic Data Sync with Duplicate Removal
const getUniqueData = (data) => (typeof data !== 'undefined') ? [...new Set(data)] : [];

let currentFilteredStylish = getUniqueData(typeof stylishNames !== 'undefined' ? stylishNames : []);
let currentFilteredSymbol = getUniqueData(typeof symbols !== 'undefined' ? symbols : []);
let currentFilteredColor = (typeof colorCodes !== 'undefined') ? [...colorCodes] : [];
let rawBios = getUniqueData(typeof igBios !== 'undefined' ? igBios : []);

// 2. TOAST NOTIFICATION
function copyMe(text) {
    navigator.clipboard.writeText(text).then(() => {
        const toast = document.getElementById('toast-container');
        if (toast) {
            toast.innerHTML = `
                <div style="font-size: 40px; margin-bottom: 10px;">🎉</div>
                <div style="letter-spacing: 2px; font-size: 14px; color: #1E90FF; font-weight:bold;">SUCCESSFULLY COPIED</div>
                <span style="color: #FFD700; font-size: 18px; display:block; margin:10px 0;">${text}</span>
            `;
            toast.style.display = 'block';
            setTimeout(() => { toast.style.display = 'none'; }, 1500);
        }
    });
}

// 3. UI NAVIGATION
function jumpTo(id) {
    const el = document.getElementById(id);
    if(el) window.scrollTo({ top: el.offsetTop - 140, behavior: "smooth" });
}

function formatNumber(num) {
    return num >= 1000 ? (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : num;
}

// 4. CORE ENGINE (DISPLAY LOGIC)
function updateView(containerId, inputId, type, dataSource) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const inputVal = document.getElementById(inputId)?.value.trim() || "Shivam";
    const start = pageTracker[type] * PAGE_SIZE;
    const end = Math.min(start + PAGE_SIZE, dataSource.length);
    
    const badge = document.getElementById(`count-${type}`);
    if(badge) badge.innerText = `Total: ${formatNumber(dataSource.length)} (${start + 1}-${end})`;

    container.innerHTML = "";
    
    if(dataSource.length === 0) {
        container.innerHTML = "<p style='text-align:center; color:#888;'>No data found...</p>";
        return;
    }

    dataSource.slice(start, end).forEach(item => {
        if(type === 'color') {
            container.innerHTML += `<div class="item"><span style="color:${item.code}; font-weight:bold;">${item.name} (${item.code})</span><button class="copy-btn" onclick="copyMe('${item.code}')">Copy</button></div>`;
        } else {
            const text = (type === 'symbol') ? item : item.replace(/\{name\}/g, inputVal);
            container.innerHTML += `<div class="item"><span>${text}</span><button class="copy-btn" onclick="copyMe('${text}')">Copy</button></div>`;
        }
    });
}

// 5. SEARCH & REFRESH LOGIC
function nextBatch(type) {
    let source = (type === 'stylish') ? currentFilteredStylish : 
                 (type === 'symbol') ? currentFilteredSymbol : 
                 (type === 'color') ? currentFilteredColor : rawBios;

    pageTracker[type] = ((pageTracker[type] + 1) * PAGE_SIZE >= source.length) ? 0 : pageTracker[type] + 1;
    updateView(`${type}List`, `search${type.charAt(0).toUpperCase() + type.slice(1)}`, type, source);
}

function resetAndDisplay(type) {
    pageTracker[type] = 0;
    let source;
    
    if(type === 'symbol') {
        const query = document.getElementById('searchSymbol').value.toLowerCase();
        source = currentFilteredSymbol.filter(s => s.toLowerCase().includes(query));
    } else if(type === 'color') {
        const query = document.getElementById('searchColor').value.toLowerCase();
        source = currentFilteredColor.filter(c => c.name.toLowerCase().includes(query));
    } else if(type === 'stylish') {
        source = currentFilteredStylish;
    } else {
        source = rawBios;
    }
    updateView(`${type}List`, `search${type.charAt(0).toUpperCase() + type.slice(1)}`, type, source);
}

// 6. FANCY TEXT GENERATOR (Fixed & Optimized)
function renderFancy() {
    const input = document.getElementById('searchFancy').value.trim() || "SHIVAM";
    const container = document.getElementById('fancyList');
    const badge = document.getElementById('count-fancy');
    if(!container) return;

    let finalStyles = [];
    const maps = [
       { a:"𝕒", b:"𝕓", c:"𝕔", d:"𝕕", e:"𝕖", f:"𝕗", g:"𝕘", h:"𝕙", i:"𝕚", j:"𝕛", k:"𝕜", l:"𝕝", m:"𝕞", n:"𝕟", o:"𝕠", p:"𝕡", q:"𝕢", r:"𝕣", s:"𝕤", t:"𝕥", u:"𝕦", v:"𝕧", w:"𝕨", x:"𝕩", y:"𝕪", z:"𝕫" },
        { a:"𝒶", b:"𝒷", c:"𝒸", d:"𝒹", e:"𝑒", f:"𝒻", g:"𝑔", h:"𝒽", i:"𝒾", j:"𝒿", k:"𝓀", l:"𝓁", m:"𝓂", n:"𝓃", o:"𝑜", p:"𝓅", q:"𝓆", r:"𝓇", s:"𝓈", t:"𝓉", u:"𝓊", v:"𝓋", w:"𝓌", x:"𝓍", y:"𝓎", z:"𝓏" },
        { a:"𝓪", b:"𝓫", c:"𝓬", d:"𝓭", e:"𝓮", f:"𝓯", g:"𝓰", h:"𝓱", i:"𝓲", j:"𝓳", k:"𝓴", l:"𝓵", m:"𝓶", n:"𝓷", o:"𝓸", p:"𝓹", q:"𝓺", r:"𝓻", s:"𝓼", t:"𝓽", u:"𝓾", v:"𝓿", w:"𝔀", x:"𝔁", y:"𝔂", z:"𝔃" },
        { a:"𝔞", b:"𝔟", c:"𝔠", d:"𝔡", e:"𝔢", f:"𝔣", g:"𝔤", h:"", i:"𝔦", j:"𝔧", k:"𝔨", l:"𝔩", m:"𝔪", n:"𝔫", o:"𝔬", p:"𝔭", q:"𝔮", r:"𝔯", s:"𝔰", t:"𝔱", u:"𝔲", v:"𝔳", w:"𝔴", x:"𝔵", y:"𝔶", z:"𝔷" },
        { a:"α", b:"в", c:"¢", d:"∂", e:"є", f:"ƒ", g:"g", h:"н", i:"ι", j:"ʝ", k:"к", l:"ℓ", m:"м", n:"η", o:"σ", p:"ρ", q:"q", r:"я", s:"ѕ", t:"т", u:"υ", v:"ν", w:"ω", x:"χ", y:"у", z:"z" },
        { a:"ค", b:"๒", c:"ς", d:"๔", e:"є", f:"Ŧ", g:"g", h:"ђ", i:"เ", j:"ן", k:"к", l:"l", m:"๓", n:"ภ", o:"๏", p:"ק", q:"ợ", r:"г", s:"ร", t:"т", u:"ย", v:"ש", w:"ฬ", x:"ץ", y:"ץ", z:"z" },
        { a:"卂", b:"乃", c:"匚", d:"ᗪ", e:"乇", f:"千", g:"Ꮆ", h:"卄", i:"丨", j:"ﾌ", k:"Ҝ", l:"ㄥ", m:"爪", n:"几", o:"ㄖ", p:"卩", q:"Ɋ", r:"尺", s:"丂", t:"ㄒ", u:"ㄩ", v:"ᐜ", w:"山", x:"乂", y:"ㄚ", z:"乙" },
        { a:"Ꮧ", b:"Ᏸ", c:"ፈ", d:"Ꮄ", e:"Ꮛ", f:"Ꭶ", g:"Ꮆ", h:"Ꮒ", i:"Ꭵ", j:"Ꮰ", k:"Ꮶ", l:"Ꮭ", m:"Ꮇ", n:"Ꮑ", o:"Ꭷ", p:"Ꭾ", q:"Ꭴ", r:"Ꮢ", s:"Ꮥ", t:"Ꮦ", u:"Ꮼ", v:"Ꮙ", w:"Ꮗ", x:"ጀ", y:"Ꭹ", z:"ፗ" },
        { a:"ą", b:"ც", c:"ƈ", d:"ɖ", e:"ɛ", f:"ʄ", g:"ɠ", h:"ɧ", i:"ı", j:"ʝ", k:"ƙ", l:"Ɩ", m:"ɱ", n:"ŋ", o:"ơ", p:"℘", q:"զ", r:"ཞ", s:"ʂ", t:"ɬ", u:"ų", v:"۷", w:"ῳ", x:"ҳ", y:"ყ", z:"ʑ" },
        { a:"ﾑ", b:"乃", c:"c", d:"d", e:"乇", f:"ｷ", g:"g", h:"ん", i:"ﾉ", j:"ﾌ", k:"ズ", l:"ﾚ", m:"M", n:"刀", o:"o", p:"ｱ", q:"q", r:"尺", s:"丂", t:"ｲ", u:"u", v:"v", w:"w", x:"ﾒ", y:"ﾘ", z:"乙" },
        { a:"ᗩ", b:"ᗷ", c:"ᑕ", d:"ᗪ", e:"E", f:"ᖴ", g:"G", h:"ᕼ", i:"I", j:"ᒍ", k:"K", l:"ᒪ", m:"ᗰ", n:"ᑎ", o:"O", p:"ᑭ", q:"ᑫ", r:"ᖇ", s:"ᔕ", t:"T", u:"ᑌ", v:"ᐯ", w:"ᗯ", x:"᙭", y:"Y", z:"ᘔ" },
        { a:"𝐀", b:"𝐁", c:"𝐂", d:"𝐃", e:"𝐄", f:"𝐅", g:"𝐆", h:"𝐇", i:"𝐈", j:"𝐉", k:"𝐊", l:"𝐋", m:"𝐌", n:"𝐍", o:"𝐎", p:"𝐏", q:"𝐐", r:"𝐑", s:"𝐒", t:"𝐓", u:"𝐔", v:"𝐕", w:"𝐖", x:"𝐗", y:"𝐘", z:"𝐙" },
        { a:"🅰", b:"🅱", c:"🅲", d:"🅳", e:"🅴", f:"🅵", g:"🅶", h:"🅷", i:"🅸", j:"🅹", k:"🅺", l:"🅻", m:"🅼", n:"🅽", o:"🅾", p:"🅿", q:"🆁", r:"🆂", s:"🆃", t:"🆄", u:"🆅", v:"🆆", w:"🆇", x:"🆈", y:"🆉", z:"🆉" },
        { a:"ⓐ", b:"ⓑ", c:"ⓒ", d:"ⓓ", e:"ⓔ", f:"ⓕ", g:"ⓖ", h:"ⓗ", i:"ⓘ", j:"ⓙ", k:"ⓚ", l:"ⓛ", m:"ⓜ", n:"ⓝ", o:"ⓞ", p:"ⓟ", q:"ⓠ", r:"ⓡ", s:"ⓢ", t:"ⓣ", u:"ⓤ", v:"ⓥ", w:"ⓦ", x:"ⓧ", y:"ⓨ", z:"ⓩ" },
        { a:"ɐ", b:"q", c:"ɔ", d:"p", e:"ǝ", f:"ɟ", g:"ƃ", h:"ɥ", i:"ᴉ", j:"ɾ", k:"ʞ", l:"l", m:"ɯ", n:"uu", o:"o", p:"d", q:"b", r:"ɹ", s:"s", t:"ʇ", u:"n", v:"ʌ", w:"ʍ", x:"x", y:"ʎ", z:"z" },
        { a:"🄰", b:"🄱", c:"🄲", d:"🄳", e:"🄴", f:"🄵", g:"🄶", h:"🄷", i:"🄸", j:"🄹", k:"🄺", l:"🄻", m:"🄼", n:"🄽", o:"🄾", p:"🄿", q:"🅀", r:"🅁", s:"🅂", t:"🅃", u:"🅄", v:"🅅", w:"🅆", x:"🅇", y:"🅈", z:"🅉" },
        { a:"ค", b:"ც", c:"ς", d:"ᑯ", e:"ꫀ", f:"ϝ", g:"ց", h:"ჩ", i:"і", j:"ʝ", k:"ƙ", l:"ӏ", m:"ო", n:"ո", o:"օ", p:"թ", q:"զ", r:"ɾ", s:"Ⴑ", t:"ե", u:"υ", v:"v", w:"ω", x:"ϰ", y:"ყ", z:"ƽ" },
        { a:"𝔸", b:"𝔹", c:"ℂ", d:"𝔻", e:"𝔼", f:"𝔽", g:"𝔾", h:"ℍ", i:"𝕀", j:"𝕁", k:"𝕂", l:"𝕃", m:"𝕄", n:"ℕ", o:"𝕆", p:"ℙ", q:"ℚ", r:"ℝ", s:"𝕊", t:"𝕋", u:"𝕌", v:"𝕍", w:"𝕎", x:"𝕏", y:"𝕐", z:"ℤ" },
        { a:"𝐀", b:"𝐁", c:"𝐂", d:"𝐃", e:"𝐄", f:"𝐅", g:"𝐆", h:"𝐇", i:"𝐈", j:"𝐉", k:"𝐊", l:"𝐋", m:"𝐌", n:"𝐍", o:"𝐎", p:"𝐏", q:"𝐐", r:"𝐑", s:"𝐒", t:"𝐓", u:"𝐔", v:"𝐕", w:"𝐖", x:"𝐗", y:"𝐘", z:"𝐙" },
        { a:"𝘈", b:"𝘉", c:"𝘊", d:"𝘋", e:"𝘌", f:"𝘍", g:"𝘎", h:"𝘏", i:"𝘐", j:"𝘑", k:"𝘒", l:"𝘓", m:"𝘔", n:"𝘕", o:"𝘖", p:"𝘗", q:"𝘘", r:"𝘙", s:"𝘚", t:"𝘛", u:"𝘜", v:"𝘝", w:"𝘞", x:"𝘟", y:"𝘠", z:"𝘡" },
        { a:"𝘼", b:"𝘽", c:"𝘾", d:"𝘿", e:"𝙀", f:"", g:"𝙂", h:"𝙃", i:"𝙄", j:"𝙅", k:"𝙆", l:"𝙇", m:"𝙈", n:"𝙉", o:"𝙊", p:"𝙋", q:"𝙌", r:"𝙍", s:"𝙎", t:"𝙏", u:"𝙐", v:"𝙑", w:"𝙒", x:"𝙓", y:"𝙔", z:"𝙕" },
        { a:"𝙰", b:"𝙱", c:"𝙲", d:"𝙳", e:"𝙴", f:"𝙵", g:"𝙶", h:"𝙷", i:"𝙸", j:"𝙹", k:"𝙺", l:"𝙻", m:"𝙼", n:"𝙽", o:"𝙾", p:"𝙿", q:"𝚀", r:"𝚁", s:"𝚂", t:"𝚃", u:"𝚄", v:"𝚅", w:"𝚆", x:"𝚇", y:"𝚈", z:"𝚉" },
        { a:"Λ", b:"B", c:"C", d:"D", e:"Ξ", f:"F", g:"G", h:"H", i:"I", j:"J", k:"K", l:"L", m:"M", n:"И", o:"O", p:"P", q:"Q", r:"Я", s:"S", t:"T", u:"U", v:"V", w:"W", x:"X", y:"Y", z:"Z" },
        { a:"[̲̅a]", b:"[̲̅b]", c:"[̲̅c]", d:"[̲̅d]", e:"[̲̅e]", f:"[̲̅f]", g:"[̲̅g]", h:"[̲̅h]", i:"[̲̅i]", j:"[̲̅j]", k:"[̲̅k]", l:"[̲̅l]", m:"[̲̅m]", n:"[̲̅n]", o:"[̲̅o]", p:"[̲̅p]", q:"[̲̅q]", r:"[̲̅r]", s:"[̲̅s]", t:"[̲̅t]", u:"[̲̅u]", v:"[̲̅v]", w:"[̲̅w]", x:"[̲̅x]", y:"[̲̅y]", z:"[̲̅z]" },
        { a:"ₐ", b:"♭", c:"꜀", d:"꜕", e:"ₑ", f:"բ", g:"و", h:"ₕ", i:"ᵢ", j:"ⱼ", k:"ₖ", l:"ₗ", m:"ₘ", n:"ₙ", o:"ₒ", p:"ₚ", q:"q", r:"ᵣ", s:"ₛ", t:"ₜ", u:"ᵤ", v:"ᵥ", w:"w", x:"ₓ", y:"ᵧ", z:"₂" },
        { a:"ᴀ", b:"ʙ", c:"ᴄ", d:"ᴅ", e:"ᴇ", f:"ꜰ", g:"ɢ", h:"ʜ", i:"ɪ", j:"ᴊ", k:"ᴋ", l:"ʟ", m:"ᴍ", n:"ɴ", o:"ᴏ", p:"ᴘ", q:"ǫ", r:"ʀ", s:"s", t:"ᴛ", u:"ᴜ", v:"ᴠ", w:"ᴡ", x:"x", y:"ʏ", z:"ᴢ" },
        { a:"🅐", b:"🅑", c:"🅒", d:"🅓", e:"🅔", f:"🅕", g:"🅖", h:"🅗", i:"🅘", j:"🅙", k:"🅚", l:"🅛", m:"🅜", n:"🅝", o:"🅟", p:"🅠", q:"🅡", r:"🅢", s:"🅣", t:"🅤", v:"🅥", w:"🅦", x:"🅧", y:"🅨", z:"🅩" },
        { a:"⒜", b:"⒝", c:"⒞", d:"⒟", e:"⒠", f:"⒡", g:"⒢", h:"⒣", i:"⒤", j:"⒥", k:"⒦", l:"⒧", m:"⒨", n:"⒩", o:"⒪", p:"⒫", q:"⒬", r:"⒭", s:"⒮", t:"⒯", u:"⒰", v:"⒱", w:"⒲", x:"⒳", y:"⒴", z:"⒵" },
        { a:"A̶", b:"B̶", c:"C̶", d:"D̶", e:"E̶", f:"F̶", g:"G̶", h:"H̶", i:"I̶", j:"J̶", k:"K̶", l:"L̶", m:"M̶", n:"N̶", o:"O̶", p:"P̶", q:"Q̶", r:"R̶", s:"S̶", t:"T̶", u:"U̶", v:"V̶", w:"W̶", x:"X̶", y:"Y̶", z:"Z̶" },
        { a:"A̴", b:"B̴", c:"C̴", d:"D̴", e:"E̴", f:"F̴", g:"G̴", h:"H̴", i:"I̴", j:"J̴", k:"K̴", l:"L̴", m:"M̴", n:"N̴", o:"O̴", p:"P̴", q:"Q̴", r:"R̴", s:"S̴", t:"T̴", u:"U̴", v:"V̴", w:"W̴", x:"X̴", y:"Y̴", z:"Z̴" },
        { a:"A̷", b:"B̷", c:"C̷", d:"D̷", e:"E̷", f:"F̷", g:"G̷", h:"H̷", i:"I̷", j:"J̷", k:"K̷", l:"L̷", m:"M̷", n:"N̷", o:"O̷", p:"P̷", q:"Q̷", r:"R̷", s:"S̷", t:"T̷", u:"U̷", v:"V̷", w:"W̷", x:"X̷", y:"Y̷", z:"Z̷" },
        { a:"A̲", b:"B̲", c:"C̲", d:"D̲", e:"E̲", f:"F̲", g:"G̲", h:"H̲", i:"I̲", j:"J̲", k:"K̲", l:"L̲", m:"M̲", n:"N̲", o:"O̲", p:"P̲", q:"Q̲", r:"R̲", s:"S̲", t:"T̲", u:"U̲", v:"V̲", w:"W̲", x:"X̲", y:"Y̲", z:"Z̲" },
        { a:"A̳", b:"B̳", c:"C̳", d:"D̳", e:"E̳", f:"F̳", g:"G̳", h:"H̳", i:"I̳", j:"J̳", k:"K̳", l:"L̳", m:"M̳", n:"N̳", o:"O̳", p:"P̳", q:"Q̳", r:"R̳", s:"S̳", t:"T̳", u:"U̳", v:"V̳", w:"W̳", x:"X̳", y:"Y̳", z:"Z̳" },
        { a:"A̾", b:"B̾", c:"C̾", d:"D̾", e:"E̾", f:"F̾", g:"G̾", h:"H̾", i:"I̾", j:"J̾", k:"K̾", l:"L̾", m:"M̾", n:"N̾", o:"O̾", p:"P̾", q:"Q̾", r:"R̾", s:"S̾", t:"T̾", u:"U̾", v:"V̾", w:"W̾", x:"X̾", y:"Y̾", z:"Z̾" },
        { a:"A♥", b:"B♥", c:"C♥", d:"D♥", e:"E♥", f:"F♥", g:"G♥", h:"H♥", i:"I♥", j:"J♥", k:"K♥", l:"L♥", m:"M♥", n:"N♥", o:"O♥", p:"P♥", q:"Q♥", r:"R♥", s:"S♥", t:"T♥", u:"U♥", v:"V♥", w:"W♥", x:"X♥", y:"Y♥", z:"Z♥" },
        { a:"A͎", b:"B͎", c:"C͎", d:"D͎", e:"E͎", f:"F͎", g:"G͎", h:"H͎", i:"I͎", j:"J͎", k:"K͎", l:"L͎", m:"M͎", n:"N͎", o:"O͎", p:"P͎", q:"Q͎", r:"R͎", s:"S͎", t:"T͎", u:"U͎", v:"V͎", w:"W͎", x:"X͎", y:"Y͎", z:"Z͎" },
        { a:"A͛", b:"B͛", c:"C͛", d:"D͛", e:"E͛", f:"F͛", g:"G͛", h:"H͛", i:"I͛", j:"J͛", k:"K͛", l:"L͛", m:"M͛", n:"N͛", o:"O͛", p:"P͛", q:"Q͛", r:"R͛", s:"S͛", t:"T͛", u:"U͛", v:"V͛", w:"W͛", x:"X͛", y:"Y͛", z:"Z͛" },
        { a:"Ⱥ", b:"Ƀ", c:"Ȼ", d:"Đ", e:"Ɇ", f:"₣", g:"Ǥ", h:"Ħ", i:"Ɨ", j:"Ɉ", k:"Ꝁ", l:"Ł", m:"M", n:"N", o:"Ø", p:"Ᵽ", q:"Ꝗ", r:"Ɍ", s:"S", t:"Ŧ", u:"Ʉ", v:"V", w:"W", x:"X", y:"Y", z:"Ƶ" },
        { a:"Д", b:"Б", c:"Ҫ", d:"D", e:"Є", f:"Ғ", g:"G", h:"Ң", i:"Ї", j:"Ј", k:"Ҝ", l:"L", m:"M", n:"Ѝ", o:"Ф", p:"ҏ", q:"Ԛ", r:"Я", s:"Ѕ", t:"Ҭ", u:"Ц", v:"V", w:"Ш", x:"Ӿ", y:"Ч", z:"Z" },
        { a:"ǟ", b:"ɮ", c:"ƈ", d:"ɖ", e:"ɛ", f:"ʄ", g:"ɢ", h:"ɦ", i:"ɨ", j:"ʝ", k:"ӄ", l:"ʟ", m:"ʍ", n:"ռ", o:"օ", p:"ք", q:"զ", r:"ʀ", s:"ֆ", t:"ȶ", u:"ʊ", v:"ʋ", w:"ա", x:"Ӽ", y:"ʏ", z:"ʐ" },
        { a:"𝔞", b:"𝔟", c:"𝔠", d:"𝔡", e:"𝔢", f:"𝔣", g:"𝔤", h:"𝔥", i:"𝔦", j:"𝔧", k:"𝔨", l:"𝔩", m:"𝔪", n:"𝔫", o:"𝔬", p:"𝔭", q:"𝔮", r:"𝔯", s:"𝔰", t:"𝔱", u:"𝔲", v:"𝔳", w:"𝔴", x:"𝔵", y:"𝔶", z:"𝔷" },
        { a:"𝖆", b:"𝖇", c:"𝖈", d:"𝖉", e:"𝖊", f:"𝖋", g:"𝖌", h:"𝖍", i:"𝖎", j:"𝖏", k:"𝖐", l:"𝖑", m:"𝖒", n:"𝖓", o:"𝖔", p:"𝖕", q:"𝖖", r:"𝖗", s:"𝖘", t:"𝖙", u:"𝖚", v:"𝖛", w:"𝖜", x:"𝖝", y:"𝖞", z:"𝖟" },
        { a:"𝕒", b:"𝕓", c:"𝕔", d:"𝕕", e:"𝕖", f:"𝕗", g:"𝕘", h:"𝕙", i:"𝕚", j:"𝕛", k:"𝕜", l:"𝕝", m:"𝕞", n:"𝕟", o:"𝕠", p:"𝕡", q:"𝕢", r:"𝕣", s:"𝕤", t:"𝕥", u:"𝕦", v:"𝕧", w:"𝕨", x:"𝕩", y:"𝕪", z:"𝕫" },
        { a:"𝖺", b:"𝖻", c:"𝖼", d:"𝖽", e:"𝖾", f:"𝖿", g:"𝗀", h:"𝗁", i:"𝗂", j:"𝗃", k:"𝗄", l:"𝗅", m:"𝗆", n:"𝗇", o:"𝗈", p:"𝗉", q:"𝗊", r:"𝗋", s:"𝗌", t:"𝗍", u:"𝗎", v:"𝗏", w:"𝗐", x:"𝗑", y:"𝗒", z:"𝗓" },
        { a:"𝗮", b:"𝗯", c:"𝗰", d:"𝗱", e:"𝗲", f:"𝗳", g:"𝗴", h:"𝗵", i:"𝗶", j:"𝗷", k:"𝗸", l:"𝗹", m:"𝗺", n:"𝗻", o:"𝗼", p:"𝗽", q:"𝗾", r:"𝗿", s:"𝘀", t:"𝘁", u:"𝘂", v:"𝘃", w:"𝘄", x:"𝘅", y:"𝘆", z:"𝘇" },
        { a:"𝘢", b:"𝘣", c:"𝘤", d:"𝘥", e:"𝘦", f:"𝘧", g:"𝘨", h:"𝘩", i:"𝘪", j:"𝘫", k:"𝘬", l:"𝘭", m:"𝘮", n:"𝘯", o:"𝘰", p:"𝘱", q:"𝘲", r:"𝘳", s:"𝘴", t:"𝘵", u:"𝘶", v:"𝘷", w:"𝘸", x:"𝘹", y:"𝘺", z:"𝘻" },
        { a:"𝙖", b:"𝙗", c:"𝙘", d:"𝙙", e:"𝙚", f:"𝙛", g:"𝙜", h:"𝙝", i:"𝙞", j:"𝙟", k:"𝙠", l:"𝙡", m:"𝙢", n:"𝙣", o:"𝙤", p:"𝙥", q:"𝙦", r:"𝙧", s:"𝙨", t:"𝙩", u:"𝙪", v:"𝙫", w:"𝙬", x:"𝙭", y:"𝙮", z:"𝙯" },
        { a:"𝚊", b:"𝚋", c:"𝚌", d:"𝚍", e:"𝚎", f:"𝚏", g:"𝚐", h:"𝚑", i:"𝚒", j:"𝚓", k:"𝚔", l:"𝚕", m:"𝚖", n:"𝚗", o:"𝚘", p:"𝚙", q:"𝚚", r:"𝚛", s:"𝚜", t:"𝚝", u:"𝚞", v:"𝚟", w:"𝚚", x:"𝚡", y:"𝚢", z:"𝚣" },
        { a:"🄰", b:"🄱", c:"🄲", d:"🄳", e:"🄴", f:"🄵", g:"🄶", h:"🄷", i:"🄸", j:"🄹", k:"🄺", l:"🄻", m:"🄼", n:"🄽", o:"🄾", p:"🄿", q:"🅀", r:"🅁", s:"🅂", t:"🅃", u:"🅄", v:"🅅", w:"🅆", x:"🅇", y:"🅈", z:"🅉" },
        { a:"🅰", b:"🅱", c:"🅲", d:"🅳", e:"🅴", f:"🅵", g:"🅶", h:"🅷", i:"🅸", j:"🅹", k:"🅺", l:"🅻", m:"🅼", n:"🅽", o:"🅾", p:"🅿", q:"🆀", r:"🆁", s:"🆂", t:"🆃", u:"🆄", v:"🆅", w:"🆆", x:"🆇", y:"🆈", z:"🆉" }
    ];

    const decorations = [ ["✨", "✨"], ["🔥", "🔥"], ["⚡", "⚡"], ["💎", "💎"], ["👑", "👑"], ["『", "』"], ["★", "★"], ["࿐", " ࿐"], ["꧁", "꧂"], ["༺", "༻"] ];

    maps.forEach(map => {
        finalStyles.push(input.split('').map(char => map[char.toLowerCase()] || char).join(''));
    });

    decorations.forEach(dec => {
        finalStyles.push(`${dec[0]} ${input} ${dec[1]}`);
    });

    const uniqueStyles = [...new Set(finalStyles)];
    container.innerHTML = "";
    uniqueStyles.forEach(style => {
        container.innerHTML += `<div class="item"><span>${style}</span><button class="copy-btn" onclick="copyMe('${style}')">Copy</button></div>`;
    });

    if(badge) badge.innerText = `Total Styles: ${uniqueStyles.length}`;
}

// 7. ORDER LOGIC
function orderService(serviceName) {
    window.location.href = `mailto:shivamhelp.hub@gmail.com?subject=Order: ${serviceName}&body=Hi Shivam, I want to order ${serviceName}.`;
}

// 8. INITIAL LOAD
window.onload = () => {
    renderFancy(); 
    ['stylish', 'bio', 'symbol', 'color'].forEach(type => resetAndDisplay(type));
};
