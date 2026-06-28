(async function () {
  // ── Configuração ──────────────────────────────────────────────────────────
  const DISCORD_WEBHOOK = "COLE_SUA_WEBHOOK_URL_AQUI";

  // ── Servidor Python local (monitor_v2.py) ─────────────────────────────────
  // Se o monitor estiver rodando, coloque o IP do seu Kali aqui:
  // Exemplo: "http://192.168.1.100:5000/track"
  // Se não quiser usar o servidor local, deixe como null
  const SERVIDOR_LOCAL  = null; // "http://SEU_IP_KALI:5000/track"
  const SECRET_KEY      = "aurudinho2025"; // deve ser igual no monitor_v2.py

  // ── Coleta de dados do visitante ──────────────────────────────────────────
  const ua = navigator.userAgent;

  const os =
    /Windows NT 10/.test(ua) ? "Windows 10/11" :
    /Windows NT 6\.1/.test(ua) ? "Windows 7" :
    /Mac OS X/.test(ua) ? "macOS" :
    /Android/.test(ua) ? "Android" :
    /iPhone|iPad/.test(ua) ? "iOS" :
    /Linux/.test(ua) ? "Linux" : "Desconhecido";

  const browser =
    /Edg\//.test(ua) ? "Edge" :
    /OPR\/|Opera/.test(ua) ? "Opera" :
    /Chrome\//.test(ua) ? "Chrome" :
    /Firefox\//.test(ua) ? "Firefox" :
    /Safari\//.test(ua) ? "Safari" : "Desconhecido";

  const screen_res = `${window.screen.width}x${window.screen.height}`;
  const lang       = navigator.language || "desconhecido";
  const page       = window.location.href;
  const referrer   = document.referrer || "Acesso direto";
  const now        = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });

  // ── IP e geolocalização ───────────────────────────────────────────────────
  let ip = "N/A", city = "N/A", country = "N/A", isp = "N/A";
  try {
    const geo = await fetch("https://ipapi.co/json/").then(r => r.json());
    ip      = geo.ip           || "N/A";
    city    = geo.city         || "N/A";
    country = geo.country_name || "N/A";
    isp     = geo.org          || "N/A";
  } catch (_) {}

  // ── Envia ao servidor Python local (monitor_v2.py) ────────────────────────
  if (SERVIDOR_LOCAL) {
    try {
      await fetch(SERVIDOR_LOCAL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Secret": SECRET_KEY,
        },
        body: JSON.stringify({
          ip, cidade: city, pais: country, isp,
          pagina: page, referrer, so: os,
          browser, resolucao: screen_res, idioma: lang,
        }),
      });
    } catch (_) {}
  }

  // ── Envia ao Discord ──────────────────────────────────────────────────────
  const payload = {
    username: "👁️ Monitor de Tráfego",
    embeds: [{
      title: "🔔 Nova visita ao site",
      color: 0x5865F2,
      fields: [
        { name: "🌐 IP",         value: `\`${ip}\``,       inline: true  },
        { name: "🏙️ Cidade",    value: city,               inline: true  },
        { name: "🌍 País",       value: country,            inline: true  },
        { name: "🏢 ISP",        value: isp,                inline: false },
        { name: "📄 Página",     value: `\`${page}\``,     inline: false },
        { name: "🔗 Veio de",    value: referrer,           inline: false },
        { name: "💻 Sistema",    value: os,                 inline: true  },
        { name: "🌐 Navegador",  value: browser,            inline: true  },
        { name: "🖥️ Resolução", value: screen_res,         inline: true  },
        { name: "🌏 Idioma",     value: lang,               inline: true  },
        { name: "🕐 Horário",    value: now,                inline: false },
      ],
      footer: { text: "Monitor-Aurudinho • GitHub Pages" },
      timestamp: new Date().toISOString(),
    }],
  };

  try {
    await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (_) {}
})();
