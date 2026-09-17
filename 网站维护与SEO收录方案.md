# Gild & Grove 网站维护与 Google SEO 收录方案

> 本文档是 Gild & Grove 产品展示与批发询盘网站的统一维护标准。
>
> 目标：提高客户信任度，让客户快速理解产品和采购方式，并为 Google 正常抓取、理解和收录网站做好准备。

## 1. 项目现状

### 1.1 品牌和业务

- 品牌：`Gild & Grove`
- 当前网站语言：英文
- 网站用途：产品展示、批发询盘
- 视觉风格：橙色、米白、温暖的家庭派对风格
- 当前品牌标题：`Gild & Grove | Everyday Jewelry & Seasonal Gifts`
- 当前品牌简介：`Elevated everyday jewelry, thoughtful gifts, and seasonal treasures for every celebration.`
- 询盘邮箱：`hz18751992559@gmail.com`

### 1.2 技术和部署

- 技术：静态 HTML、CSS、JavaScript
- GitHub：`xihupan/gild-grove`
- 默认分支：`main`
- Cloudflare Pages 项目：`gild-grove`
- 临时地址：`https://gild-grove.pages.dev`
- 正式域名：`gildngrove.com`
- 备用域名：`www.gildngrove.com`
- 部署方式：推送 GitHub `main` 后由 Cloudflare Pages 自动部署

### 1.3 当前产品

1. `PP Woven Halloween Pumpkin Decorations`
2. `Black PP Woven Halloween Pumpkin Decoration`

已确认的产品信息：

- 两个产品材质均为 PP。
- 两个产品内部均可以放置 LED 灯。
- LED 灯是否包含在产品中，目前未确认。
- 产品一颜色：Natural Beige / Natural Brown。
- 产品二颜色：Black。

## 2. 总体原则

网站维护和 SEO 调整必须遵守以下原则：

1. 先保证真实、准确，再考虑宣传效果。
2. 不把未确认的 MOQ、价格、库存、交期、认证或配送能力写成承诺。
3. 页面标题、正文、图片、结构化数据和域名必须表达同一件事。
4. 首页负责快速说明品牌和主推品类，产品详情页负责完整规格。
5. 每次代码、图片、域名或部署设置变更前必须备份。
6. 修改后先本地预览，用户确认后再提交 GitHub 和 Cloudflare Pages。

## 3. 上线前一次性 SEO 基础调整

以下项目是 Google 收录的必要基础，建议一次完成。

### 3.1 确定主域名并统一跳转

Google 需要知道哪个网址是正式地址。必须从以下方案中确定一个：

```text
方案 A：主域名 https://gildngrove.com/
        www.gildngrove.com 跳转到 gildngrove.com

方案 B：主域名 https://www.gildngrove.com/
        gildngrove.com 跳转到 www.gildngrove.com
```

以最近检查结果看，`www.gildngrove.com` 可以访问，但根域名 `gildngrove.com` 仍需复核 DNS。正式配置前应完成：

- Cloudflare Pages 同时绑定根域名和 `www` 域名。
- 一个地址作为唯一主域名。
- 另一个地址使用 301 跳转到主域名。
- HTTPS 两个地址均正常。
- 页面中的 `canonical`、`og:url`、Sitemap 和结构化数据全部使用主域名。

### 3.2 统一标题和描述

当前页面主要展示 Halloween 南瓜装饰，但原标题包含 `Everyday Jewelry`。在首饰产品真正上线前，建议使用：

```text
Title:
Gild & Grove | Wholesale Halloween Decor & Seasonal Gifts

Meta description:
Wholesale PP woven Halloween pumpkin decorations and seasonal giftable accents for retailers, event buyers, and seasonal displays.
```

如果近期确定会增加首饰产品，可以保留：

```text
Gild & Grove | Everyday Jewelry & Seasonal Gifts
```

但页面必须同步增加对应的首饰内容，避免标题和实际产品不一致。

标题、描述和正文中应自然使用与业务相关的词组，例如：

```text
wholesale Halloween decorations
PP woven pumpkin decoration
seasonal retail displays
LED-ready pumpkin decoration
wholesale seasonal gifts
```

不需要添加 `meta keywords`，也不要在页面底部堆砌关键词。

### 3.3 增加规范网址和社交分享信息

首页 `<head>` 中应包含：

```html
<link rel="canonical" href="https://主域名/" />
```

同时确保以下信息使用同一个主域名：

- `og:title`
- `og:description`
- `og:url`
- `og:image`
- Sitemap 中的页面地址
- Product 结构化数据中的图片地址

### 3.4 增加 `robots.txt`

在网站根目录增加 `robots.txt`：

```text
User-agent: *
Allow: /

Sitemap: https://主域名/sitemap.xml
```

正式地址确定后，把 `主域名` 替换为实际域名。不要把首页、产品页或 FAQ 页面误写入 `Disallow`。

### 3.5 增加 `sitemap.xml`

静态网站至少收录首页；增加独立页面后再加入产品页、Wholesale 页和 FAQ 页：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://主域名/</loc>
    <lastmod>2026-09-17</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

Sitemap 只放真实存在、返回 `200`、允许 Google 抓取的页面，不放本地地址、测试地址或 404 地址。

### 3.6 增加结构化数据

建议增加 JSON-LD：

- `Organization`：品牌、网站地址、业务邮箱。
- `WebSite`：网站名称和主域名。
- `Product`：产品名称、图片、品牌、材质、颜色、描述。

产品没有确认价格、库存和评价时，不要添加虚假的：

- `price`
- `availability`
- `aggregateRating`
- `review`

结构化数据应与页面可见内容一致，不能只在代码里放页面没有展示的承诺。

## 4. 页面内容和信任度调整

### 4.1 首页首屏

客户应在 5 秒内看懂网站卖什么、服务谁、下一步做什么。首屏建议包含：

```text
Wholesale seasonal decor and giftable accents
PP woven Halloween decorations for retailers, event buyers, and seasonal displays.
View products
Request a wholesale quote
```

可以突出已经确认的信息：

```text
PP material | LED-ready designs | Multiple styles
```

首屏不要只写氛围型口号，也不要添加未经确认的 `Factory direct`、`Fast shipping`、`Low MOQ`、`Certified` 或 `In stock`。

### 4.2 产品卡片和详情页

产品卡片优先展示：

1. 产品名称。
2. 一句话卖点。
3. Material / Styles / Size。
4. LED 使用说明。
5. `Request product details` 或 `Request a wholesale quote`。

建议为每个产品增加独立详情页：

```text
/products/pp-woven-halloween-pumpkins/
/products/black-pp-woven-halloween-pumpkin/
```

产品详情页应包含：

- 独立英文标题和描述
- 产品主图和细节图
- 材质、颜色、尺寸、重量
- 所有款式
- LED 是否包含的准确说明
- 包装、MOQ、样品、交期和 OEM/ODM
- 适用场景
- 询盘按钮

产品标题示例：

```text
PP Woven Halloween Pumpkin Decorations | Gild & Grove
Black PP Woven Halloween Pumpkin Decoration | Gild & Grove
```

### 4.3 批发信息

每个产品应逐步补充以下采购字段。未确认时统一使用 `To be confirmed` 或 `On request`：

```text
SKU
MOQ
Packaging
Sample availability
Lead time
OEM/ODM
Wholesale price
Set quantity
```

Wholesale 区域应说明合作流程：

```text
1. Choose products
2. Tell us quantity and delivery requirements
3. Receive product details and quotation
4. Confirm samples and order information
```

### 4.4 FAQ 和联系信息

FAQ 应回答：

- Can an LED light be placed inside?
- Is the LED light included?
- Can I request wholesale product details?
- What is the MOQ?
- What packaging options are available?
- Can I request samples?
- Do you support OEM or ODM?
- How can I request a quotation?

目前至少显示：

- 业务邮箱：`hz18751992559@gmail.com`
- Wholesale inquiries
- 当前通过邮箱回复

后续可以增加真实企业邮箱、WhatsApp 手机号、公司所在地区和回复时间。没有真实资料时，不要虚构地址、团队、客户评价、工厂照片、认证或销售数据。

### 4.5 基础页面

建议保留或增加：

- `404.html`
- FAQ 区域或 FAQ 页面
- Wholesale 页面
- 隐私说明
- 询盘数据处理说明
- Favicon
- Open Graph 分享图片

## 5. 产品资料和图片标准

### 5.1 新产品资料模板

以后新增产品时统一提供：

```text
Category:
Subcategory:
Product Name:
SKU:
Material:
Color:
Available Styles:
Dimensions:
Unit Weight:
Set Quantity:
Product Function:
Application:
Packaging:
MOQ:
Sample Availability:
Lead Time:
Wholesale Price:
OEM/ODM:
Safety Information:
Image Paths:
```

最少必须确认：产品名称、品类、材质、颜色、尺寸、重量、款式、包装、MOQ、交期和图片路径。

### 5.2 当前两个南瓜产品待补资料

- LED 灯是否包含。
- LED 类型。
- 是否需要电池。
- 电池是否包含。
- 帽子是否可拆。
- 每箱数量和外箱资料。
- 单个包装方式。
- 是否支持混款或混批。
- 是否支持客户 Logo、定制颜色和定制包装。
- 是否支持 OEM/ODM。
- 样品政策和样品费用。
- 正常交期和旺季交期。

产品二还必须确认：

```text
Chubby Pumpkin：19 x 28 cm 还是 20 x 28 cm
Jack-o'-Lantern Pumpkin：19 x 28 cm 还是 20 x 28 cm
```

在确认前可写为：

```text
Exact dimensions available on request.
```

### 5.3 图片标准

每个产品建议准备：

```text
main.jpg
detail.jpg
lifestyle.jpg
size.jpg
packaging.jpg
```

图片应分别展示完整主图、材质细节、使用场景、尺寸对比和包装方式。建议：

- 尺寸为 1600 x 1600 px 或更高。
- 使用 JPG 或 WebP。
- 文件名使用英文和数字，并包含产品关键词。
- 每张图片设置准确英文 `alt`。
- 保留图片 `width` 和 `height`，减少页面跳动。
- 首屏主图不使用 `loading="lazy"`。
- 首屏以下图片可以使用 `loading="lazy"`。
- 发布后检查正式域名上的图片是否返回 `200`。

推荐命名示例：

```text
pp-woven-halloween-pumpkins-main.jpg
pp-woven-halloween-pumpkins-led-display.jpg
black-pp-woven-halloween-pumpkin-main.jpg
black-woven-pumpkin-outdoor-display.jpg
```

## 6. 询盘功能调整

当前表单使用 `mailto:`，会打开客户本地邮箱客户端，网站不会保存询盘数据。短期可以保留，但它不是完整的在线表单。

后续建议接入 Formspree、Getform、Basin，或 Cloudflare Worker + 邮件服务。接入后需要：

- 提交成功提示。
- 提交失败提示和备用邮箱。
- 通知发送到 `hz18751992559@gmail.com`。
- 手机浏览器和没有邮件客户端的电脑也可以提交。
- 询盘字段包含：姓名、公司、邮箱、国家/地区、产品、数量、交期、OEM/ODM 和留言。

当前邮箱跳转提示应明确说明：

```text
This form prepares an email in your mail app. No inquiry data is stored on this site.
```

## 7. 性能、可访问性和技术检查

### 7.1 每次发布前

- 首页、根域名和 `www` 域名能否访问。
- 主域名跳转是否正确。
- HTTPS 是否没有安全警告。
- CSS、JavaScript 和图片是否全部正常加载。
- 页面标题、描述、canonical 和 `og:url` 是否使用同一主域名。
- `robots.txt` 和 `sitemap.xml` 是否可以直接访问。
- 产品图片是否正常显示。
- 移动端菜单、FAQ、产品规格展开是否正常。
- 询盘按钮是否自动带入产品名称。
- 表单必填校验、邮箱地址和状态提示是否正常。
- 页面是否没有横向溢出、文字重叠或按钮被遮挡。
- 404 页面能否返回首页或发邮件。

### 7.2 测试尺寸

- 375 px 手机
- 390 px 手机
- 768 px 平板
- 1280 px 桌面
- 1440 px 宽屏

### 7.3 性能和可访问性

- 图片压缩，优先使用 WebP。
- 首屏内容尽量减少不必要的第三方脚本。
- 保持图片尺寸属性和稳定的布局空间。
- 所有有意义的图片使用准确 `alt`。
- 表单使用可见的 `label`。
- 键盘可以访问导航、按钮、FAQ 和表单。
- 保留清晰的焦点样式。
- 点击目标至少约 44 x 44 px。
- 支持 `prefers-reduced-motion`。
- 正文文字和背景保持足够对比度。

## 8. Google Search Console 收录流程

SEO 文件和域名配置完成并正式发布后：

1. 打开 Google Search Console。
2. 添加 Domain Property：

   ```text
   gildngrove.com
   ```

3. 按 Google 要求在 DNS 添加 TXT 验证记录。
4. 验证成功后提交：

   ```text
   https://主域名/sitemap.xml
   ```

5. 使用 URL Inspection 检查首页。
6. 点击 `Request Indexing`。
7. 检查首页、产品页、Wholesale 页和 FAQ 页的抓取状态。
8. 定期查看覆盖率、抓取错误、移动端问题和搜索关键词。

Google 收录通常需要几天到数周，不应通过重复提交、关键词堆砌或购买低质量外链来强行加速。

## 9. 代码和部署维护流程

用户已经确认：修改前按日期备份，允许直接修改代码，修改后先看预览，确认后允许自动部署。后续统一执行：

1. 检查 Git 当前状态和线上版本。
2. 按日期打包备份：

   ```text
   D:\app\gild-grove-backups\YYYY-MM-DD\gild-grove-YYYY-MM-DD.zip
   ```

3. 核对本次要改的内容、产品资料和图片路径。
4. 修改 HTML、CSS、JavaScript、图片或 SEO 文件。
5. 本地启动预览。
6. 测试桌面端、移动端、表单、图片和链接。
7. 把预览地址或截图提供给用户确认。
8. 用户确认后提交 GitHub `main`。
9. 等待 Cloudflare Pages 自动部署。
10. 检查 `pages.dev`、主域名和备用域名。
11. 记录提交编号、修改内容和线上结果。

只新增或修改 Markdown 文档时，不需要创建网站备份；涉及网站代码、图片、SEO 文件、域名或部署设置时，必须先备份。

## 10. 维护节奏

### 每周

- 打开首页和两个正式域名。
- 检查 HTTPS、图片、导航、FAQ 和询盘入口。
- 检查业务邮箱是否有遗漏询盘。

### 每月

- 更新产品名称、款式、图片和可售状态。
- 更新 MOQ、包装、交期和 OEM/ODM 信息。
- 检查 Search Console 抓取错误和覆盖率。
- 检查 Cloudflare 部署记录、错误请求和域名状态。

### 每个销售季前

- 将当前季节主推产品放在首页前部。
- 核对库存、交期和采购截止时间。
- 更新场景图和 FAQ。
- 检查产品规格、询盘字段和主域名。

## 11. 待统一确认清单

在正式执行完整 SEO 发布前，请一次确认以下项目：

### 域名

```text
主域名：gildngrove.com / www.gildngrove.com
另一域名是否 301 跳转：是 / 否
```

### SEO 标题

```text
A. Gild & Grove | Wholesale Halloween Decor & Seasonal Gifts
B. Gild & Grove | Everyday Jewelry & Seasonal Gifts
```

### 产品一

```text
LED 是否包含：是 / 否 / 按订单确认
LED 类型：
是否需要电池：是 / 否
电池是否包含：是 / 否
MOQ：
包装方式：
每箱数量：
样品政策：
交期：
是否支持混款：是 / 否
是否支持 OEM：是 / 否
是否支持 ODM：是 / 否
```

### 产品二

```text
Chubby Pumpkin 准确尺寸：19 x 28 cm / 20 x 28 cm
Jack-o'-Lantern Pumpkin 准确尺寸：19 x 28 cm / 20 x 28 cm
Water-Drop 帽子：可拆 / 不可拆
Chubby 帽子：可拆 / 不可拆
Jack-o'-Lantern 帽子：可拆 / 不可拆
LED 是否包含：是 / 否 / 按订单确认
LED 类型：
是否需要电池：是 / 否
电池是否包含：是 / 否
MOQ：
包装方式：
每箱数量：
样品政策：
交期：
是否支持混款：是 / 否
是否支持 OEM：是 / 否
是否支持 ODM：是 / 否
```

### 批发政策

```text
是否允许两个产品混批：是 / 否
是否有阶梯价格：是 / 否
是否支持客户 Logo：是 / 否
是否支持定制颜色：是 / 否
是否支持定制包装：是 / 否
是否公开公司所在地区：是 / 否
是否有企业邮箱：
是否有真实 WhatsApp 手机号：
```

### 询盘方式

```text
当前继续使用邮箱跳转
后续接入 Formspree
后续接入其他在线表单服务
```

## 12. 推荐执行顺序

```text
第 1 步：确认主域名和 SEO 标题
第 2 步：修复根域名与 www 的访问、HTTPS 和 301 跳转
第 3 步：补齐产品二尺寸和两款产品的批发资料
第 4 步：增加 canonical、robots.txt、sitemap.xml 和结构化数据
第 5 步：确认首页标题、描述、产品文字和图片 alt
第 6 步：完成移动端、性能、404 和链接检查
第 7 步：本地预览并由用户确认
第 8 步：提交 GitHub，等待 Cloudflare Pages 部署
第 9 步：在 Google Search Console 验证域名并提交 Sitemap
第 10 步：后续增加独立产品页、Wholesale 页和真实企业信息
```

当前不建议为了 SEO 立即迁移到 Shopify 或 WordPress。现有静态网站已经可以完成产品展示、独立产品页、Sitemap、结构化数据和 Google 收录基础工作。产品数量和询盘量明显增加后，再考虑 CMS、数据库或后台管理系统。
