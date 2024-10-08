const Product = require("../../models/product.model")
const ProductCategory = require("../../models/product-category.model")
const Account = require("../../models/account.model")

const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")
const createTreeHelper = require("../../helpers/createTree")
const systemConfig = require("../../config/system")

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
    // Filter Status
    const filterStatus = filterStatusHelper(req.query)

    let find = {
        deleted: false
    }

    if (req.query.status) {
        find.status = req.query.status
    }

    // Search
    const objectSearch = searchHelper(req.query)

    if (objectSearch.regex) {
        find.title = objectSearch.regex
    }

    const records = await ProductCategory.find(find)

    for (const record of records) {
        // Lấy ra thông tin người tạo
        const user = await Account.findOne({
            _id: record.createdBy.account_id
        })

        if (user) {
            record.accountFullName = user.fullName
            console.log(record.accountFullName)
        }

        // Lấy ra thông tin cập nhật gần nhất
        const updatedBy = record.updatedBy[record.updatedBy.length-1]
        if (updatedBy) {
            const userUpdated = await Account.findOne({
                _id: updatedBy.account_id
            })

            updatedBy.accountFullName =  userUpdated.fullName
        }
    }                                  

    const newRecords = createTreeHelper.tree(records)
  
    res.render("admin/pages/products-category/index", {
        pageTitle: "Danh mục sản phẩm",
        records: newRecords,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
    })
}

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => { 
    let find = {
        deleted: false
    }

    const records = await ProductCategory.find(find)

    const newRecords = createTreeHelper.tree(records)
    
    res.render("admin/pages/products-category/create", {
        pageTitle: "Thêm mới danh mục sản phẩm",
        records: newRecords
    })
}

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
    const permissons = res.locals.role.permissions

    if (permissions.includes("products-category_create")) {
        if (req.body.position == "") {
            const count = await ProductCategory.countDocuments()
    
            req.body.position = count + 1
        } else {
            req.body.position = parseInt(req.body.position)
        }
    
        req.body.createdBy = {
            account_id: res.locals.user.id
        }
    
        const record = new ProductCategory(req.body)
        await record.save()
    
        res.redirect(`${systemConfig.prefixAdmin}/products-category`)
    } else {
        res.send("403")
    }
    
}

// [PATCH] /admin/products-category/changeStatus/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status
    const id = req.params.id

    await ProductCategory.updateOne({_id: id}, {status: status})

    req.flash("success", "Thay đổi trạng thái thành công!")
    res.redirect("back")
}

// [PATCH] /admin/products-category/changeMulti
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type
    const ids = req.body.ids.split(", ")

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    switch (type) {
        case "active":
            await ProductCategory.updateMany({_id: { $in: ids } }, { 
                status: "active",
                $push: { updatedBy: updatedBy }
            })
            break
        case "inactive":
            await ProductCategory.updateMany({_id : { $in: ids } }, { 
                status: "inactive",
                $push: { updatedBy: updatedBy }
            })
            break
        case "delete-all":
            await ProductCategory.updateMany({_id : { $in: ids } }, { 
                deleted: true, 
                deletedBy: {
                    account_id: res.locals.user.id,
                    deletedAt: new Date()
                }
            })
            break
        case "change-position":
            for (const i of ids) {
                let [id, position] = i.split("-")
                position = parseInt(position)
                await Product.updateMany({_id: id}, { 
                    position: position,
                    $push: { updatedBy: updatedBy }
                })
            }
            break
        default:
            break
    }

    req.flash("success", "Thay đổi trạng thái thành công!")
    res.redirect("back")
}

// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id 
        }

        const record = await ProductCategory.findOne(find)

        const records = await ProductCategory.find({
            deleted: false
        })

        const newRecords = createTreeHelper.tree(records)

        res.render("admin/pages/products-category/edit", {
            pageTitle: "Chỉnh sửa danh mục sản phẩm",
            record: record,
            records: newRecords
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products-category`)
    }
}

// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id 

    req.body.position = parseInt(req.body.position)
    
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    await ProductCategory.updateOne({ _id: id }, {
        ...req.body,
        $push: { updatedBy: updatedBy }
    })

    req.flash("success", "Cập nhật danh mục thành công!")
    res.redirect("back")
}

// [GET] /admin/products-category/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id 
        }

        const record = await ProductCategory.findOne(find)

        if (record.parent_id) {
            const parent = await ProductCategory.findOne({
                deleted: false,
                _id : record.parent_id
            }).select("title")
    
            record.parentTitle = parent.title
        }

        res.render("admin/pages/products-category/detail", {
            pageTitle: "Chi tiết danh mục sản phẩm",
            record: record
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products-category`)
    }
}

// [DELETE] /admin/products-category/delete/:id
module.exports.delete = async (req, res) => {
    const id = req.params.id

    await ProductCategory.updateOne(
        { _id : id }, 
        {
            deleted: true, 
            deletedBy: {
                account_id: res.locals.user.id,
                deletedAt: new Date()
            }
        }
    )

    req.flash("success", "Đã xóa danh mục thành công!")
    res.redirect("back")
}

